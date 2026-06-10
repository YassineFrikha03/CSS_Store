import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Camera, CheckCircle, Loader, AlertTriangle } from 'lucide-react';

const FaceScanner = ({ onScanSuccess, mode = 'register' }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Erreur chargement modèles IA:", err);
        setErrorMessage("Impossible de charger l'Intelligence Artificielle.");
      }
    };
    loadModels();
  }, []);

  const captureAndScan = useCallback(async () => {
    if (!webcamRef.current || !modelsLoaded) return;
    
    setScanning(true);
    setScanResult(null);
    setErrorMessage('');

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Impossible de capturer l'image de la webcam.");
      }

      // Convertir base64 en élément Image HTML
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => { img.onload = resolve; });

      // Détecter le visage
      const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                                     .withFaceLandmarks()
                                     .withFaceDescriptor();

      if (detection) {
        // Succès
        setScanResult('success');
        // Convertir Float32Array en tableau classique pour l'API
        const descriptorArray = Array.from(detection.descriptor);
        onScanSuccess(descriptorArray, imageSrc); // On renvoie le descripteur et l'image (pour preview)
      } else {
        // Échec de la détection
        setScanResult('error');
        setErrorMessage("Aucun visage détecté. Rapprochez-vous de la caméra et assurez-vous d'être bien éclairé.");
      }
    } catch (err) {
      console.error(err);
      setScanResult('error');
      setErrorMessage("Erreur lors de l'analyse du visage.");
    } finally {
      setScanning(false);
    }
  }, [modelsLoaded, onScanSuccess]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-white w-full">
      {!modelsLoaded ? (
        <div className="flex flex-col items-center py-10 text-zinc-400">
          <Loader className="animate-spin mb-4" size={32} />
          <p className="text-sm font-medium">Chargement de l'IA FaceID...</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-lg overflow-hidden border-2 border-zinc-700 bg-black aspect-video flex items-center justify-center">
            {scanResult === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full w-full bg-emerald-900/40 text-emerald-400">
                <CheckCircle size={48} className="mb-2" />
                <p className="font-bold">Visage Enregistré !</p>
              </div>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
              />
            )}
            
            {/* Ligne de scan animée */}
            {scanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-scan shadow-[0_0_15px_#3b82f6]"></div>
            )}
          </div>

          {scanResult === 'error' && (
            <div className="mt-3 text-red-400 text-xs font-medium flex items-center gap-1.5 bg-red-950/50 px-3 py-2 rounded-lg">
              <AlertTriangle size={14} />
              {errorMessage}
            </div>
          )}

          {scanResult !== 'success' && (
            <button
              type="button"
              onClick={captureAndScan}
              disabled={scanning}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                scanning ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
              }`}
            >
              {scanning ? <Loader className="animate-spin" size={18} /> : <Camera size={18} />}
              {mode === 'register' ? 'Scanner mon visage' : 'Vérifier mon identité'}
            </button>
          )}
          
          {scanResult === 'success' && mode === 'register' && (
            <button
              type="button"
              onClick={() => setScanResult(null)}
              className="mt-4 text-xs text-zinc-400 hover:text-white transition-colors underline cursor-pointer"
            >
              Recommencer le scan
            </button>
          )}
        </div>
      )}
      
      {/* Ajouter le style keyframes pour l'animation de scan */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}} />
    </div>
  );
};

export default FaceScanner;
