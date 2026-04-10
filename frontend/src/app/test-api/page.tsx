'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export default function TestApiPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testProjects = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getProjects();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLibrary = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getLibrary();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const data = await apiClient.login('admin@mercurywanda.com', 'MercuryWanda2024!');
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAdminProjects = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAdminProjects();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLeads = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getLeads();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🧪 API Test Page
          </h1>
          <p className="text-slate-600 mb-8">
            Test kết nối giữa Frontend và Backend API
          </p>

          {/* Public Endpoints */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">
              📢 Public Endpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testHealth}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🏥 Test Health
              </button>
              <button
                onClick={testProjects}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📁 Test Projects
              </button>
              <button
                onClick={testLibrary}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📚 Test Library
              </button>
            </div>
          </div>

          {/* Admin Endpoints */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">
              🔐 Admin Endpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testLogin}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔑 Test Login
              </button>
              <button
                onClick={testAdminProjects}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📊 Admin Projects
              </button>
              <button
                onClick={testLeads}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📋 Test Leads
              </button>
            </div>
          </div>

          {/* Result Display */}
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">
              📄 Response
            </h2>
            <div className="bg-slate-900 rounded-xl p-6 overflow-auto max-h-96">
              <pre className="text-green-400 text-sm font-mono">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  result || '👆 Click a button to test API'
                )}
              </pre>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              📝 Instructions
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>✅ Make sure backend is running on <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:5000</code></li>
              <li>✅ Test public endpoints first (Health, Projects, Library)</li>
              <li>✅ Then test admin login to get authentication token</li>
              <li>✅ After login, test admin endpoints (Admin Projects, Leads)</li>
              <li>✅ Check the response in the black box below</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
