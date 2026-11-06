import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      onShowToast('Please fill out all contact fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      onShowToast('Message saved to MySQL database successfully! Our team will respond shortly.', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to submit message to MySQL', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#5B4BDB] uppercase tracking-wider">
          Support & Academic Inquiries
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17172B] font-display">
          Contact the LEARNOVA Team
        </h1>
        <p className="text-xs sm:text-sm text-[#52526B]">
          Have questions regarding academic courses, corporate enrollment, or mini-project verification? Send us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E8F0] shadow-xs space-y-6">
          <h3 className="text-base font-bold text-[#17172B] font-display">
            Contact Information
          </h3>

          <div className="space-y-4 text-xs text-[#52526B]">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#17172B] block">Email Inquiries</span>
                <span>support@learnova.edu</span>
                <span className="block text-[11px] text-slate-400">admin@learnova.edu</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#17172B] block">Telephone</span>
                <span>+91 (0) 40 2345 6789</span>
                <span className="block text-[11px] text-slate-400">Mon - Fri: 9:00 AM - 6:00 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#17172B] block">Campus Headquarters</span>
                <span>Dept. of Computer Science & Engineering</span>
                <span className="block text-[11px] text-slate-400">B.Tech Web Development Lab, Tech City</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0EDFF] text-[#5B4BDB] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#17172B] block">Evaluation Hours</span>
                <span>Academic demonstration support 24/7</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0EDFF] text-xs text-slate-500">
            All submitted messages are recorded directly in the MySQL <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">contact_messages</code> table and viewable in the Admin Dashboard.
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E6E8F0] shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#17172B] font-display">
                Thank You for Reaching Out!
              </h3>
              <p className="text-xs text-[#52526B] max-w-md mx-auto leading-relaxed">
                Your message has been successfully saved to our MySQL database. An academic coordinator will review your inquiry shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#17172B] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shaik Rauf"
                    className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#17172B] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#17172B] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Course Syllabus & Project Inquiry"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#17172B] mb-1">Message Body *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, feedback, or curriculum requirements in detail..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border border-[#E6E8F0] rounded-xl focus:outline-hidden focus:border-[#5B4BDB] focus:bg-white text-[#17172B]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#5B4BDB] hover:bg-[#4A3BB8] rounded-xl shadow-md shadow-[#5B4BDB]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Saving to MySQL...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Message to MySQL</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
