import React, { useRef, useState, useCallback } from 'react';
import { Camera, Image, Trash2, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundFx, speakText } from '../utils/audio';

interface PhotoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (photoDataUrl: string) => void;
  onPhotoRemoved?: () => void;
  currentPhoto?: string;
  voiceEnabled?: boolean;
}

type Step = 'menu' | 'camera' | 'preview';

export const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({
  isOpen,
  onClose,
  onPhotoSelected,
  onPhotoRemoved,
  currentPhoto,
  voiceEnabled = false,
}) => {
  const [step, setStep] = useState<Step>('menu');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const speak = (text: string) => {
    if (voiceEnabled) speakText(text);
  };

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  // Open camera
  const openCamera = async () => {
    soundFx.playClick();
    speak('Abrindo câmera. Aguarde.');
    setCameraError(null);
    setStep('camera');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      speak('Câmera aberta. Toque no botão para tirar a foto.');
    } catch (err) {
      setCameraError(
        'Não foi possível acessar a câmera. Verifique as permissões do navegador.'
      );
      speak('Não foi possível acessar a câmera.');
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    soundFx.playSuccess();
    speak('Foto tirada! Veja como ficou.');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center-crop to square
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewUrl(dataUrl);
    stopCamera();
    setStep('preview');
  };

  // Flip camera front/back
  const flipCamera = async () => {
    stopCamera();
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    soundFx.playClick();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next, width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Não foi possível trocar a câmera.');
    }
  };

  // Open gallery / file picker
  const openGallery = () => {
    soundFx.playClick();
    speak('Abrindo galeria. Escolha uma foto.');
    fileInputRef.current?.click();
  };

  // Handle file selection from gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      speak('Por favor, selecione uma imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreviewUrl(result);
      setStep('preview');
      speak('Foto escolhida! Veja como ficou.');
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Confirm selected photo
  const confirmPhoto = () => {
    if (!previewUrl) return;
    soundFx.playSuccess();
    speak('Foto de perfil atualizada com sucesso!');
    onPhotoSelected(previewUrl);
    handleClose();
  };

  // Retake / go back
  const retake = () => {
    soundFx.playClick();
    setPreviewUrl(null);
    setStep('menu');
  };

  // Remove current photo
  const handleRemovePhoto = () => {
    soundFx.playClick();
    speak('Foto de perfil removida.');
    onPhotoRemoved?.();
    handleClose();
  };

  // Close modal and cleanup
  const handleClose = () => {
    stopCamera();
    setStep('menu');
    setPreviewUrl(null);
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">

        {/* ─── MENU STEP ─── */}
        {step === 'menu' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">📸 Foto de Perfil</h2>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Escolha como quer adicionar sua foto</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Current photo preview */}
            {currentPhoto && (
              <div className="flex justify-center py-5 bg-slate-50 border-b border-slate-100">
                <img
                  src={currentPhoto}
                  alt="Foto atual"
                  className="w-24 h-24 rounded-full object-cover border-4 border-sky-200 shadow-md"
                />
              </div>
            )}

            {/* Options */}
            <div className="p-5 space-y-3">
              {/* Gallery */}
              <button
                onClick={openGallery}
                className="w-full flex items-center gap-4 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-sky-900 font-black px-5 py-4 rounded-2xl text-base transition-all active:scale-95 shadow-sm"
              >
                <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-black text-lg">Escolher da Galeria</div>
                  <div className="text-sm text-sky-700 font-semibold">Selecionar uma foto salva</div>
                </div>
              </button>

              {/* Camera */}
              <button
                onClick={openCamera}
                className="w-full flex items-center gap-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-emerald-900 font-black px-5 py-4 rounded-2xl text-base transition-all active:scale-95 shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-black text-lg">Tirar Foto Agora</div>
                  <div className="text-sm text-emerald-700 font-semibold">Usar a câmera do celular</div>
                </div>
              </button>

              {/* Remove (only shown if there's a current photo) */}
              {currentPhoto && onPhotoRemoved && (
                <button
                  onClick={handleRemovePhoto}
                  className="w-full flex items-center gap-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-800 font-black px-5 py-4 rounded-2xl text-base transition-all active:scale-95 shadow-sm"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-lg">Remover Foto</div>
                    <div className="text-sm text-red-600 font-semibold">Voltar para o avatar padrão</div>
                  </div>
                </button>
              )}

              {/* Cancel */}
              <button
                onClick={handleClose}
                className="w-full text-slate-600 hover:bg-slate-100 font-black px-5 py-3.5 rounded-2xl text-base transition-colors"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {/* ─── CAMERA STEP ─── */}
        {step === 'camera' && (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">📷 Tirar Foto</h2>
                <p className="text-sm font-semibold text-slate-500">Centralize seu rosto e toque no botão</p>
              </div>
              <button
                onClick={() => { stopCamera(); setStep('menu'); }}
                className="p-2.5 rounded-2xl bg-slate-100 text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-8 text-center space-y-4">
                <div className="text-5xl">📵</div>
                <p className="text-base font-bold text-red-700">{cameraError}</p>
                <p className="text-sm text-slate-500 font-semibold">
                  Tente escolher uma foto da galeria ou verifique as permissões no seu navegador.
                </p>
                <button
                  onClick={() => { stopCamera(); setStep('menu'); }}
                  className="bg-slate-800 text-white font-black px-6 py-3 rounded-2xl"
                >
                  Voltar
                </button>
              </div>
            ) : (
              <div className="relative bg-black">
                {/* Video preview */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-square object-cover"
                  onLoadedMetadata={() => videoRef.current?.play()}
                />
                {/* Circular guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full border-4 border-white/60 shadow-inner" />
                </div>

                {/* Flip camera button */}
                <button
                  onClick={flipCamera}
                  className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full"
                  title="Virar câmera"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            )}

            {!cameraError && (
              <div className="p-5 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 rounded-full bg-white border-4 border-emerald-500 shadow-xl flex items-center justify-center hover:bg-emerald-50 active:scale-95 transition-all"
                  title="Tirar foto"
                  aria-label="Tirar foto agora"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ─── PREVIEW STEP ─── */}
        {step === 'preview' && previewUrl && (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">✅ Confirmar Foto</h2>
                <p className="text-sm font-semibold text-slate-500">Esta foto ficou boa?</p>
              </div>
              <button onClick={retake} className="p-2.5 rounded-2xl bg-slate-100 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex justify-center py-8 bg-slate-50">
              <img
                src={previewUrl}
                alt="Prévia da foto escolhida"
                className="w-40 h-40 rounded-full object-cover border-4 border-emerald-300 shadow-xl"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-5 space-y-3">
              <button
                onClick={confirmPhoto}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-4 rounded-2xl text-lg shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-6 h-6" />
                Usar esta Foto
              </button>
              <button
                onClick={retake}
                className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-6 py-4 rounded-2xl text-base transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Tentar Outra Foto
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
