import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  MessageSquarePlus, 
  X, 
  Sparkles,
  Heart
} from 'lucide-react';
import { Review } from '../types';
import { submitReviewToDb } from '../services/dbService';

interface TestimonialsProps {
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ reviews, onReviewAdded }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [roomStayed, setRoomStayed] = useState('Cedar Valley Panorama Suite');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    try {
      setSubmitting(true);
      const created = await submitReviewToDb({
        authorName: authorName.trim(),
        authorLocation: authorLocation.trim() || 'Guest',
        rating,
        comment: comment.trim(),
        roomStayed,
        stayDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });

      onReviewAdded(created);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setShowReviewModal(false);
        setAuthorName('');
        setAuthorLocation('');
        setComment('');
      }, 1800);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-[#08120e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-3">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Guest Experiences & Stories</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fcfaf6] mb-3">
              Cherished Words from Our Guests
            </h2>
            <p className="text-[#ebe3d5] text-sm sm:text-base font-light max-w-xl">
              Authentic stories shared by couples, families, remote professionals, and travelers 
              who found their slice of Himalayan peace at Vrind.
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#11291f] hover:bg-[#183a2d] border border-[#d4af37]/40 text-[#d4af37] hover:text-[#f7e096] text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0c1a14] border border-[#1e3b2e] rounded-3xl p-7 shadow-xl shadow-black/40 flex flex-col justify-between hover:border-[#c59b3f]/40 transition-colors"
            >
              <div>
                {/* Rating & Quote Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'text-[#d4af37] fill-[#d4af37]'
                            : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#254636]" />
                </div>

                <p className="text-xs sm:text-sm text-[#ebe3d5] leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info Footer */}
              <div className="pt-4 border-t border-[#18392c] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#fcfaf6] flex items-center gap-1.5">
                    <span>{rev.authorName}</span>
                    {rev.verified && (
                      <span title="Verified Guest">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-[#a89d89]">
                    {rev.authorLocation} {rev.roomStayed ? `• ${rev.roomStayed}` : ''}
                  </p>
                </div>
                {rev.stayDate && (
                  <span className="text-[10px] text-[#7d705c]">{rev.stayDate}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Review */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-lg bg-[#0c1a14] border border-[#234335] rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 p-2 text-[#a89d89] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="font-cinzel text-xl font-bold text-[#fcfaf6] mb-1">
                  Share Your Himalayan Memory
                </h3>
                <p className="text-xs text-[#a89d89]">
                  Your review will be saved to our guest ledger and displayed on the website.
                </p>
              </div>

              {successMsg ? (
                <div className="py-8 text-center text-emerald-400 space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto" />
                  <p className="font-semibold text-base">Thank you for sharing your experience!</p>
                  <p className="text-xs text-[#b8ab94]">Your review has been successfully saved to the database.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 cursor-pointer transition-colors ${
                              star <= rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-[#d4af37] font-bold ml-2">{rating} of 5 Stars</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#a89d89] mb-1 font-medium">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Rohini Sen"
                        className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#a89d89] mb-1 font-medium">City / Country</label>
                      <input
                        type="text"
                        value={authorLocation}
                        onChange={(e) => setAuthorLocation(e.target.value)}
                        placeholder="e.g. Mumbai, India"
                        className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#a89d89] mb-1 font-medium">Room / Cottage Stayed In</label>
                    <select
                      value={roomStayed}
                      onChange={(e) => setRoomStayed(e.target.value)}
                      className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                    >
                      <option value="Cedar Valley Panorama Suite">Cedar Valley Panorama Suite</option>
                      <option value="Pinecone Orchard Cottage">Pinecone Orchard Cottage</option>
                      <option value="Himalayan Stargazer Attic">Himalayan Stargazer Attic</option>
                      <option value="Kailash View Family Haven">Kailash View Family Haven</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a89d89] mb-1 font-medium">Your Experience Review *</label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share details about the mountain views, food, quiet atmosphere, or hospitality..."
                      className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-[#214333] text-[#a89d89] hover:bg-[#08120e]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] font-bold shadow-lg"
                    >
                      {submitting ? 'Submitting...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
