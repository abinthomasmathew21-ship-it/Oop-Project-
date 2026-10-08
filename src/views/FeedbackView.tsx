import React from 'react';
import { Complaint } from '../types';
import { MessageSquare, Star, CheckCircle2, User, Calendar } from 'lucide-react';

interface FeedbackViewProps {
  complaints: Complaint[];
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ complaints }) => {
  const resolvedWithFeedback = complaints.filter((c) => c.feedback);

  return (
    <div className="space-y-6 pb-12">
      <div className="pb-3 border-b border-[#E2DCD0] dark:border-[#24322B]">
        <h1 className="text-xl font-bold tracking-tight text-[#1C201E] dark:text-[#F1EFEA]">
          Work Order Quality & User Feedback
        </h1>
        <p className="text-xs text-[#646E68] dark:text-[#8E9B93] mt-0.5">
          Student, faculty, and staff verification ratings submitted upon maintenance completion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            AVERAGE SATISFACTION
          </span>
          <div className="text-2xl font-bold font-tabular text-[#1B4332] dark:text-[#347A57] mt-1 flex items-center gap-1.5">
            5.00 <span className="text-amber-500 text-lg">★</span>
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            100% positive verification rate
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            AUDITED WORK ORDERS
          </span>
          <div className="text-2xl font-bold font-tabular text-[#2D6A6C] dark:text-[#4EA896] mt-1">
            {resolvedWithFeedback.length} Completed
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            Signed off with remarks
          </p>
        </div>

        <div className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19]">
          <span className="font-mono text-[11px] text-[#646E68] dark:text-[#8E9B93] uppercase">
            FIRST-TIME FIX RATIO
          </span>
          <div className="text-2xl font-bold font-tabular text-emerald-600 dark:text-emerald-400 mt-1">
            98.2%
          </div>
          <p className="text-[11px] text-[#646E68] dark:text-[#8E9B93] mt-1">
            No repeat callback tickets
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-[#1C201E] dark:text-[#F1EFEA]">
          RESOLVED AUDIT REVIEWS & SIGN-OFFS
        </h2>

        <div className="space-y-3">
          {resolvedWithFeedback.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-md border border-[#E2DCD0] dark:border-[#24322B] bg-white dark:bg-[#151D19] space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#ECE8DE] dark:border-[#1F2A24]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#2D6A6C] dark:text-[#4EA896]">
                    {item.id}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-[#1C201E] dark:text-[#F1EFEA]">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                  {'★'.repeat(item.feedback?.rating || 5)}
                  <span className="text-[#646E68] dark:text-[#8E9B93] text-[11px] ml-1">
                    ({item.feedback?.rating}/5)
                  </span>
                </div>
              </div>

              <p className="text-[#1C201E] dark:text-[#F1EFEA] text-xs italic leading-relaxed">
                "{item.feedback?.comment}"
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#646E68] dark:text-[#8E9B93] font-mono">
                <span>VERIFIED BY: {item.feedback?.studentName}</span>
                <span>SIGN-OFF: {item.feedback?.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
