"use client";

import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import ImageCropper from "@/components/ImageCropper";
import { toast } from "sonner";
import { ID, storage } from "@/app/appwrite";
import { Permission, Role } from "appwrite";
import { updateDatabase } from "@/services/crudService";

const ProfilePicture = ({ id, url }: { id?: string; url?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null | undefined>(
    null
  );
  const [, setFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleButtonClick = () => fileInputRef.current?.click();

  useEffect(() => {
    if (url) setCroppedImage(url);
  }, [url]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const updateProfilePicture = async (file: File | null) => {
    if (!id) {
      toast.error("User is not authorized to perform the action");
      return;
    }

    if (!file) return;
    setLoading(true);
    try {
      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
        ]
      );

      const href = storage
        .getFileView(
          process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
          uploadedFile.$id
        )
        .toString();

      await updateDatabase(id, { profileUrl: href });
      setCroppedImage(href);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload. Try again.");
      setImageSrc(url || null);
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!id) {
      toast.error("User is not authorized to perform the action");
      return;
    }

    try {
      await updateDatabase(id, { profileUrl: null });
      setCroppedImage(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove picture. Try again.");
    }
  };

  const showDeleteConfirmation = (onConfirm: () => void) => {
    if (!croppedImage) return;
    toast("Are you sure?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes, Remove",
        onClick: onConfirm,
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          console.log("Deletion cancelled");
        },
      },
      duration: 10000,
    });
  };

  return (
    <>
      <div className="my-3 z-[10] bg-[#87e0f92f] border border-blue-200 rounded-lg shadow-lg p-4 flex items-center">
        <Image
          src={croppedImage || "/man.png"}
          alt="#man_logo"
          height={50}
          width={50}
          className=" rounded-full bg-cover"
          onError={() => setCroppedImage(url)}
        />
        <div className="text-[#3F3D3D] w-full px-3 font-semibold text-sm">
          Current Profile Picture
          <p className="text-[#6D6A6A] font-extralight text-xs">
            Click &apos;Update&apos; to change the Profile picture
          </p>
        </div>

        <div>
          <span className="flex justify-between items-center px-4 text-sm">
            <label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className="text-[#938787] pl-1 pr-2 cursor-pointer active:scale-[.98] rounded-lg border border-gray-400 shadow-md"
              >
                <Upload className="inline m-1" />
                Upload
              </button>
            </label>
            <X
              onClick={() => showDeleteConfirmation(removeProfilePicture)}
              className="text-red-600 cursor-pointer ml-2"
            />
          </span>
          <p className="text-xs lg:whitespace-nowrap mt-1 text-[#6C6767]">
            Max 5MB & Supports jpg, png, webp
          </p>
        </div>
      </div>

      {loading && (
        <div className=" text-center h-screen py-1/3 text-white font-bold fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm">
          Uploading ...
        </div>
      )}

      {/* Overlay Cropper */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <ImageCropper
            imageSrc={imageSrc}
            onClose={() => setShowCropper(false)}
            onCropDone={(croppedFile) => {
              setShowCropper(false);
              updateProfilePicture(croppedFile);
            }}
          />
        </div>
      )}
    </>
  );
};

export default ProfilePicture;
