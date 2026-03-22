"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";

interface Props {
  imageSrc: string;
  onClose: () => void;
  onCropDone: (croppedFile: File) => void;
}

const ImageCropper: React.FC<Props> = ({ imageSrc, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImage = async (): Promise<File> => {
    if (!croppedAreaPixels) throw new Error("No cropped area");

    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx?.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject("Failed to create blob from canvas");
        }

        const file = new File([blob], "cropped-image.png", {
          type: "image/png",
        });

        resolve(file);
      }, "image/png");
    });
  };

  const handleCropDone = async () => {
    try {
      const croppedFile = await getCroppedImage();
      onCropDone(croppedFile);
    } catch (error) {
      console.error("Cropping error:", error);
      alert("Something went wrong while cropping");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-[90vw] max-w-lg">
      <div className="relative w-full h-64 bg-gray-100">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          objectFit="horizontal-cover"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button className="bg-gray-300 px-4 py-1 rounded-md" onClick={onClose}>
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded-md"
          onClick={handleCropDone}
        >
          Crop & Save
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
