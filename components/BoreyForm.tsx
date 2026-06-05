// BoreyForm.tsx – Add/Edit Borey modal component
import React, { useState, useEffect } from 'react';
import { Borey } from '../types';
import { X } from 'lucide-react';

interface BoreyFormProps {
  mode: 'add' | 'edit';
  initialData?: Borey;
  onSubmit: (borey: Borey) => void;
  onCancel: () => void;
}

export const BoreyForm: React.FC<BoreyFormProps> = ({ mode, initialData, onSubmit, onCancel }) => {
  const [developer, setDeveloper] = useState('');
  const [project, setProject] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [baseValue, setBaseValue] = useState('');

  // Populate fields when editing, otherwise clear for adding
  useEffect(() => {
    if (initialData) {
      setDeveloper(initialData.developer);
      setProject(initialData.project);
      setProvince(initialData.province);
      setDistrict(initialData.district);
      setLocationNote(initialData.locationNote);
      setMarketValue(String(initialData.marketValue));
      setBaseValue(String(initialData.baseValue));
    } else if (mode === 'add') {
      // Reset all fields for a new borey
      setDeveloper('');
      setProject('');
      setProvince('');
      setDistrict('');
      setLocationNote('');
      setMarketValue('');
      setBaseValue('');
    }
  }, [initialData, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!developer || !project || !province || !district || !marketValue || !baseValue) {
      alert('Please fill all required fields.');
      return;
    }
    const borey: Borey = {
      developer,
      project,
      province,
      district,
      locationNote,
      marketValue: Number(marketValue),
      baseValue: Number(baseValue),
    };
    onSubmit(borey);
  };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
            {mode === 'add' ? 'Add New Borey' : 'Edit Borey'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Developer <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={developer}
                onChange={e => setDeveloper(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={project}
                onChange={e => setProject(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location Note
              </label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={locationNote}
                onChange={e => setLocationNote(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Market Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={marketValue}
                  onChange={e => setMarketValue(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Base Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={baseValue}
                  onChange={e => setBaseValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};
