import { useState, useRef } from 'react';

const CORRECT_PASSWORD = '123456'; // THAY = mật khẩu thật (giữ bí mật, đừng để lộ online)
const WEB_APP_URL = 'https://script.google.com/macros/s/ID-WEB-APP/exec'; // THAY = URL Web App thật

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Sai mật khẩu!');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        text: content,
        imageBase64: image?.split(',')[1] || null,
      };

      await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage('✅ Cập nhật nhật ký thành công!');
      setContent('');
      setImage(null);
      fileInputRef.current.value = null;

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('❌ Lỗi khi gửi nhật ký!');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Nhập mật khẩu</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4"
            placeholder="••••••••"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Vào nhật ký
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📔 DIARY NGUYENANHTUAN</h1>
      <textarea
        className="w-full max-w-2xl h-40 p-4 border rounded mb-4 resize-none"
        placeholder="Nhập nội dung nhật ký..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="mb-4"
      />

      {image && (
        <img src={image} alt="preview" className="w-64 h-auto mb-4 border rounded shadow" />
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Cập nhật
      </button>

      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
    </div>
  );
}

export default App;
