import React, { useState } from 'react';

const AdTemplateGenerator = () => {
  // State for uploaded assets
  const [assets, setAssets] = useState({
    logo: null,
    background: null,
    productImage: null,
    icon: null,
  });

  // State for chatbot input
  const [chatInput, setChatInput] = useState('');

  // State for generated ad content
  const [adContent, setAdContent] = useState({
    format: '',
    headline: '',
    body: '',
    cta: '',
    visualDirection: '',
    layoutInstructions: '',
    textOverlay: '',
    colorUsage: '',
  });

  // State for selected template
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Render the ad visually
  const renderAd = () => {
    if (!selectedTemplate) {
      return <p>No template selected. Use the chatbot to generate an ad.</p>;
    }

    return (
      <div className="ad-preview relative w-full h-96 border bg-gray-100">
        {/* Background Image */}
        {assets.background && (
          <img
            src={assets.background}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>

        {/* Logo */}
        {assets.logo && (
          <img
            src={assets.logo}
            alt="Logo"
            className="absolute top-4 left-4 w-16 h-16 object-contain"
          />
        )}

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white">
          <h1 className="text-2xl font-bold mb-2">{adContent.headline}</h1>
          <p className="text-lg mb-4">{adContent.body}</p>
          <button className="bg-white text-blue-900 px-4 py-2 rounded">
            {adContent.cta}
          </button>
        </div>
      </div>
    );
  };

  // Handle asset upload
  const handleAssetUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setAssets((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  // Handle chatbot input
  const handleChatInput = (e) => {
    setChatInput(e.target.value);
  };

  // Generate ad content based on chatbot input
  const generateAdContent = () => {
    // Placeholder logic for generating ad content
    setAdContent({
      format: 'Instagram Square',
      headline: 'Start Your Canada PR Journey',
      body: 'Trusted immigration guidance for professionals and families.',
      cta: 'Check Eligibility',
      visualDirection: 'Professional and clean',
      layoutInstructions: 'Logo top-left, text center-left',
      textOverlay: 'Dark blue transparent layer',
      colorUsage: 'Blue and white',
    });

    // Placeholder for selecting a template
    setSelectedTemplate('Instagram Square Template');
  };

  // Editable Design Controls
  const EditableControls = () => (
    <div className="editable-controls space-y-4">
      <h2 className="text-lg font-bold">Editable Design Controls</h2>

      {/* Headline */}
      <div>
        <label className="block font-semibold">Headline:</label>
        <input
          type="text"
          className="w-full border p-2"
          value={adContent.headline}
          onChange={(e) =>
            setAdContent((prev) => ({ ...prev, headline: e.target.value }))
          }
        />
      </div>

      {/* Body */}
      <div>
        <label className="block font-semibold">Body:</label>
        <textarea
          className="w-full border p-2"
          rows={3}
          value={adContent.body}
          onChange={(e) =>
            setAdContent((prev) => ({ ...prev, body: e.target.value }))
          }
        />
      </div>

      {/* CTA */}
      <div>
        <label className="block font-semibold">Call-to-Action (CTA):</label>
        <input
          type="text"
          className="w-full border p-2"
          value={adContent.cta}
          onChange={(e) =>
            setAdContent((prev) => ({ ...prev, cta: e.target.value }))
          }
        />
      </div>

      {/* Overlay Strength */}
      <div>
        <label className="block font-semibold">Overlay Strength:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={parseInt(adContent.textOverlay.split(' ')[3] || '50')}
          onChange={(e) =>
            setAdContent((prev) => ({
              ...prev,
              textOverlay: `Dark blue transparent layer ${e.target.value}%`,
            }))
          }
        />
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block font-semibold">Text Alignment:</label>
        <select
          className="w-full border p-2"
          value={adContent.layoutInstructions.split(' ')[2] || 'center-left'}
          onChange={(e) =>
            setAdContent((prev) => ({
              ...prev,
              layoutInstructions: `Logo top-left, text ${e.target.value}`,
            }))
          }
        >
          <option value="center-left">Center-Left</option>
          <option value="center-right">Center-Right</option>
          <option value="top-center">Top-Center</option>
          <option value="bottom-center">Bottom-Center</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="ad-template-generator flex gap-4 p-4">
      {/* Left Section: Asset Upload + Chatbot Input */}
      <div className="left-section w-1/3 space-y-4">
        {/* Asset Upload Section */}
        <div className="asset-upload space-y-2">
          <h2 className="text-lg font-bold">Upload Assets</h2>
          <div>
            <label>Logo:</label>
            <input type="file" onChange={(e) => handleAssetUpload(e, 'logo')} />
          </div>
          <div>
            <label>Background Image:</label>
            <input type="file" onChange={(e) => handleAssetUpload(e, 'background')} />
          </div>
          <div>
            <label>Product Image (Optional):</label>
            <input type="file" onChange={(e) => handleAssetUpload(e, 'productImage')} />
          </div>
          <div>
            <label>Icon (Optional):</label>
            <input type="file" onChange={(e) => handleAssetUpload(e, 'icon')} />
          </div>
        </div>

        {/* Chatbot Input Section */}
        <div className="chatbot-input space-y-2">
          <h2 className="text-lg font-bold">Chatbot Input</h2>
          <textarea
            className="w-full border p-2"
            rows={4}
            placeholder="Type your ad request here..."
            value={chatInput}
            onChange={handleChatInput}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={generateAdContent}
          >
            Generate Ad
          </button>
        </div>

        <EditableControls />
      </div>

      {/* Right Section: Live Preview */}
      <div className="right-section w-2/3">
        <h2 className="text-lg font-bold">Live Ad Preview</h2>
        <div className="live-preview border p-4">
          {renderAd()}
        </div>
      </div>
    </div>
  );
};

export default AdTemplateGenerator;