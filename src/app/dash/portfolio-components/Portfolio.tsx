'use client';
import { useState } from 'react';
import UploadImage from "./UploadImage";

export default function Portfolio() {
  const [uploadComponents, setUploadComponents] = useState([{ id: 0, hasImage: false }]);

  const handleImageUpload = (componentId: number) => {
    setUploadComponents(prev => {
      const updated = prev.map(comp =>
        comp.id === componentId ? { ...comp, hasImage: true } : comp
      );

      // Only add new component if the last one now has an image
      const lastComponent = updated[updated.length - 1];
      if (lastComponent.hasImage) {
        updated.push({ id: Date.now(), hasImage: false });
      }

      return updated;
    });
  };

  return (
    <div className="bg-custom-offwhite min-h-screen overflow-y-auto w-[100%] float-right text-black px-[5%] py-[.5%] rounded-[30px]">
      <div className="text-xl mb-6">
        Portfolio
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploadComponents.map((component) => (
          <UploadImage
            key={component.id}
            onImageUpload={() => handleImageUpload(component.id)}
          />
        ))}
      </div>
    </div>
  );
}