import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Sliders, Shield, Bell, Check, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [campusName, setCampusName] = useState('St. Jude University of Engineering & Applied Sciences');
  const [semesterCode, setSemesterCode] = useState('FALL-2026');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 019-9111');
  const [autoDispatchUrgent, setAutoDispatchUrgent] = useState(true);
  const [cadGridFidelity, setCadGridFidelity] = useState('Standard 32px Architectural');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div className="pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
          CampusCare System Configuration
        </h1>
        <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
          Workstation preferences, architectural blueprint parameters, and emergency dispatch routing.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Campus Identity */}
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-3">
          <h2 className="font-mono text-xs font-bold uppercase text-[#2D6A6C] dark:text-[#4EA896]">
            Campus Institutional Profile
          </h2>

          <div>
            <label className="block text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase mb-1">
              University / Campus Institution
            </label>
            <input
              type="text"
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase mb-1">
                Academic Session Code
              </label>
              <input
                type="text"
                value={semesterCode}
                onChange={(e) => setSemesterCode(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase mb-1">
                Emergency Physical Plant Hotline
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA] focus:outline-hidden focus:border-[#2D6A6C]"
              />
            </div>
          </div>
        </div>

        {/* Blueprint Visual Identity */}
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-3">
          <h2 className="font-mono text-xs font-bold uppercase text-[#2D6A6C] dark:text-[#4EA896]">
            Campus Blueprint Visual Identity
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-[#ECE8DE] dark:border-[#1F2A24]">
            <div>
              <div className="font-semibold text-[#1C201E] dark:text-[#F1EFEA]">
                Theme Mode ({theme.toUpperCase()})
              </div>
              <div className="text-[11px] text-[#646E68] dark:text-[#8E9B93]">
                Warm architectural paper tone (Light) or deep graphite-green (Dark).
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1 rounded border border-[#E2DCD0] dark:border-[#24322B] font-mono text-xs font-bold"
            >
              Toggle
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#646E68] dark:text-[#8E9B93] uppercase mb-1">
              Architectural CAD Grid Pitch
            </label>
            <select
              value={cadGridFidelity}
              onChange={(e) => setCadGridFidelity(e.target.value)}
              className="w-full px-3 py-2 rounded border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] text-[#1C201E] dark:text-[#F1EFEA]"
            >
              <option value="Fine 16px Architectural">Fine 16px Architectural Grid</option>
              <option value="Standard 32px Architectural">Standard 32px Architectural Grid</option>
              <option value="Engineering 64px Grid">Engineering 64px Metric Grid</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="font-semibold text-[#1C201E] dark:text-[#F1EFEA]">
                Auto-Page On-Duty Lead on Urgent Priority
              </div>
              <div className="text-[11px] text-[#646E68] dark:text-[#8E9B93]">
                Instantly page trade supervisor via campus radio when severity is flagged Urgent.
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoDispatchUrgent}
              onChange={(e) => setAutoDispatchUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-[#1B4332] accent-[#1B4332] dark:accent-[#347A57]"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <Check className="w-4 h-4" /> Parameters saved successfully.
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#1B4332] hover:bg-[#143527] dark:bg-[#347A57] text-white font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
