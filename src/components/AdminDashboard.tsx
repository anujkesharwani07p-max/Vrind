import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Bed, 
  Calendar, 
  DollarSign, 
  Mail, 
  RefreshCw, 
  LogOut, 
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  Filter,
  Check,
  UserCheck,
  Image as ImageIcon,
  Copy,
  ExternalLink,
  Sparkles,
  Camera,
  UploadCloud,
  Upload,
  Loader2,
  FileImage,
  Globe,
  Home,
  Info,
  Mountain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Room, Booking, Enquiry, SiteContent, GalleryItem, HomestayDetails, HeroContent, AboutContent } from '../types';
import { processImageFile } from '../utils/imageUtils';
import { 
  getAllBookings, 
  updateBookingStatus, 
  getRooms, 
  updateRoomInDb, 
  createRoomInDb, 
  deleteRoomFromDb, 
  getAllEnquiries, 
  updateEnquiryStatus, 
  seedDefaultRooms,
  getSiteContentFromDb,
  updateSiteContentInDb,
  getCachedSiteContent
} from '../services/dbService';
import { GALLERY_ITEMS, INITIAL_SITE_CONTENT } from '../data/initialData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomsUpdated: () => void;
  onSiteContentUpdated?: () => void;
}

// Curated high-res Himalayan & cozy room photo presets
const PHOTO_PRESETS = [
  {
    category: 'Mountain Views',
    name: 'Snowy Pir Panjal Range',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Mountain Views',
    name: 'Misty Alpine Valley Sunrise',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Mountain Views',
    name: 'Cloud Sea over Dhauladhar',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Cozy Rooms',
    name: 'Cedar Wood Fireplace Suite',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Cozy Rooms',
    name: 'Sunlit Mountain View Bedroom',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'Cozy Rooms',
    name: 'Attic Stargazer Timber Room',
    url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Cozy Rooms',
    name: 'Warm Fleece Bed & Window View',
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    category: 'Architecture & Nature',
    name: 'Kathkuni Stone & Timber Cottage',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Architecture & Nature',
    name: 'Ancient Deodar Pine Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },
  {
    category: 'Architecture & Nature',
    name: 'Campfire Under Starlit Sky',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Dining & Food',
    name: 'Farm-to-Table Orchard Breakfast',
    url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    category: 'Dining & Food',
    name: 'Traditional Pahadi Clay Oven Cooking',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRoomsUpdated,
  onSiteContentUpdated
}) => {
  const { user, isAdmin, loginWithGoogle, loginAsDemoAdmin, logout, authError } = useAuth();

  const [activeTab, setActiveTab] = useState<'content' | 'rooms' | 'photos' | 'bookings' | 'enquiries'>('content');
  
  // Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filters & Search
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Site Content State
  const initialContent = getCachedSiteContent();
  const [siteContent, setSiteContent] = useState<SiteContent>(initialContent);
  const [contentSubTab, setContentSubTab] = useState<'homestay' | 'hero' | 'about' | 'gallery'>('homestay');
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Homestay Details form state
  const [hsName, setHsName] = useState(initialContent.homestayDetails.name);
  const [hsTagline, setHsTagline] = useState(initialContent.homestayDetails.tagline);
  const [hsAddress, setHsAddress] = useState(initialContent.homestayDetails.address);
  const [hsPhone, setHsPhone] = useState(initialContent.homestayDetails.phone);
  const [hsPhoneFormatted, setHsPhoneFormatted] = useState(initialContent.homestayDetails.phoneFormatted);
  const [hsWhatsapp, setHsWhatsapp] = useState(initialContent.homestayDetails.whatsapp);
  const [hsEmail, setHsEmail] = useState(initialContent.homestayDetails.email);
  const [hsAltitude, setHsAltitude] = useState(initialContent.homestayDetails.altitude);
  const [hsCheckIn, setHsCheckIn] = useState(initialContent.homestayDetails.checkInTime);
  const [hsCheckOut, setHsCheckOut] = useState(initialContent.homestayDetails.checkOutTime);

  // Hero form state
  const [heroBadge, setHeroBadge] = useState(initialContent.hero.badge);
  const [heroHeadline, setHeroHeadline] = useState(initialContent.hero.headline);
  const [heroSubtitle, setHeroSubtitle] = useState(initialContent.hero.subtitle);
  const [heroImage, setHeroImage] = useState(initialContent.hero.heroImage);
  const [heroDragActive, setHeroDragActive] = useState(false);

  // About form state
  const [aboutTitle, setAboutTitle] = useState(initialContent.about.title);
  const [aboutSubtitle, setAboutSubtitle] = useState(initialContent.about.subtitle);
  const [aboutStoryP1, setAboutStoryP1] = useState(initialContent.about.storyP1);
  const [aboutStoryP2, setAboutStoryP2] = useState(initialContent.about.storyP2);
  const [aboutBadgeText, setAboutBadgeText] = useState(initialContent.about.badgeText);
  const [aboutMainImage, setAboutMainImage] = useState(initialContent.about.mainImage);
  const [aboutSecondaryImage, setAboutSecondaryImage] = useState(initialContent.about.secondaryImage);
  const [aboutMainDragActive, setAboutMainDragActive] = useState(false);
  const [aboutSecDragActive, setAboutSecDragActive] = useState(false);

  // Gallery state
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(initialContent.gallery);
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalSubtitle, setNewGalSubtitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState('mountains');
  const [newGalImage, setNewGalImage] = useState('');
  const [galDragActive, setGalDragActive] = useState(false);

  // Editing Room State - Comprehensive Text & Photos
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editRoomName, setEditRoomName] = useState<string>('');
  const [editRoomTagline, setEditRoomTagline] = useState<string>('');
  const [editRoomDescription, setEditRoomDescription] = useState<string>('');
  const [editRoomType, setEditRoomType] = useState<Room['roomType']>('deluxe_suite');
  const [editBedType, setEditBedType] = useState<string>('');
  const [editView, setEditView] = useState<string>('');
  const [editSizeSqFt, setEditSizeSqFt] = useState<number>(0);
  const [editAmenitiesText, setEditAmenitiesText] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [editImageInputMode, setEditImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [editDragActive, setEditDragActive] = useState<boolean>(false);
  const [isSavingRoom, setIsSavingRoom] = useState<boolean>(false);

  // Selected room in Photos Tab
  const [selectedPhotoRoomId, setSelectedPhotoRoomId] = useState<string>('');
  const [photoTabDragActive, setPhotoTabDragActive] = useState<boolean>(false);

  // New Room State
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState(4500);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomType, setNewRoomType] = useState<'deluxe_suite' | 'cedar_cottage' | 'attic_room' | 'valley_villa'>('deluxe_suite');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomImageUrl, setNewRoomImageUrl] = useState('');
  const [newRoomImages, setNewRoomImages] = useState<string[]>([]);
  const [newRoomInputMode, setNewRoomInputMode] = useState<'upload' | 'url'>('upload');
  const [newRoomDragActive, setNewRoomDragActive] = useState<boolean>(false);

  // Passkey State for reviewer fallback
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  // Load data when modal opens and admin is active
  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAllAdminData();
    }
  }, [isOpen, isAdmin]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [bookingsData, roomsData, enquiriesData, contentData] = await Promise.all([
        getAllBookings(),
        getRooms(),
        getAllEnquiries(),
        getSiteContentFromDb()
      ]);
      setBookings(bookingsData);
      setRooms(roomsData);
      setEnquiries(enquiriesData);
      if (roomsData.length > 0 && !selectedPhotoRoomId) {
        setSelectedPhotoRoomId(roomsData[0].id);
      }

      if (contentData) {
        setSiteContent(contentData);
        setHsName(contentData.homestayDetails.name);
        setHsTagline(contentData.homestayDetails.tagline);
        setHsAddress(contentData.homestayDetails.address);
        setHsPhone(contentData.homestayDetails.phone);
        setHsPhoneFormatted(contentData.homestayDetails.phoneFormatted);
        setHsWhatsapp(contentData.homestayDetails.whatsapp);
        setHsEmail(contentData.homestayDetails.email);
        setHsAltitude(contentData.homestayDetails.altitude);
        setHsCheckIn(contentData.homestayDetails.checkInTime);
        setHsCheckOut(contentData.homestayDetails.checkOutTime);

        setHeroBadge(contentData.hero.badge);
        setHeroHeadline(contentData.hero.headline);
        setHeroSubtitle(contentData.hero.subtitle);
        setHeroImage(contentData.hero.heroImage);

        setAboutTitle(contentData.about.title);
        setAboutSubtitle(contentData.about.subtitle);
        setAboutStoryP1(contentData.about.storyP1);
        setAboutStoryP2(contentData.about.storyP2);
        setAboutBadgeText(contentData.about.badgeText);
        setAboutMainImage(contentData.about.mainImage);
        setAboutSecondaryImage(contentData.about.secondaryImage);

        setGalleryList(contentData.gallery);
      }
    } catch (e) {
      console.error('Failed to load admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      setActionMessage(`Booking ${bookingId} updated to ${newStatus}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleToggleRoomAvailability = async (room: Room) => {
    const updatedStatus = !room.isAvailable;
    try {
      await updateRoomInDb(room.id, { isAvailable: updatedStatus }, room);
      setRooms((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, isAvailable: updatedStatus } : r))
      );
      onRoomsUpdated();
      setActionMessage(`${room.name} is now ${updatedStatus ? 'Available' : 'Unavailable'}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Availability toggle failed:', err);
    }
  };

  const handleStartEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setEditRoomName(room.name);
    setEditRoomTagline(room.tagline || '');
    setEditRoomDescription(room.description);
    setEditRoomType(room.roomType);
    setEditBedType(room.bedType || '');
    setEditView(room.view || '');
    setEditSizeSqFt(room.sizeSqFt || 400);
    setEditAmenitiesText((room.amenities || []).join('\n'));
    setEditPrice(room.pricePerNight);
    setEditCapacity(room.capacityGuests);
    setEditImages([...room.images]);
    setNewImageUrl('');
  };

  const handleAddPhotoToEdit = () => {
    if (!newImageUrl.trim()) return;
    setEditImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemovePhotoFromEdit = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainPhoto = (index: number) => {
    if (index === 0) return;
    setEditImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const handleSaveRoomEdits = async (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    setIsSavingRoom(true);
    try {
      const targetImages = editImages.length > 0 ? editImages : room.images;
      const parsedAmenities = editAmenitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedFields: Partial<Room> = {
        name: editRoomName.trim() || room.name,
        tagline: editRoomTagline.trim() || room.tagline,
        description: editRoomDescription.trim() || room.description,
        roomType: editRoomType,
        bedType: editBedType.trim() || room.bedType,
        view: editView.trim() || room.view,
        sizeSqFt: Number(editSizeSqFt) || room.sizeSqFt,
        amenities: parsedAmenities.length > 0 ? parsedAmenities : room.amenities,
        pricePerNight: Number(editPrice) || room.pricePerNight,
        capacityGuests: Number(editCapacity) || room.capacityGuests,
        images: targetImages
      };

      const res = await updateRoomInDb(roomId, updatedFields, room);

      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomId
            ? { ...r, ...updatedFields }
            : r
        )
      );

      setEditingRoomId(null);
      onRoomsUpdated();
      setActionMessage(res?.message || 'Room details and photos saved successfully!');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      console.error('Failed to save room edits:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save changes';
      setActionMessage(`Error: ${msg}`);
      setTimeout(() => setActionMessage(null), 3500);
    } finally {
      setIsSavingRoom(false);
    }
  };

  const handleSaveSiteContent = async () => {
    setIsSavingContent(true);
    try {
      const updated = await updateSiteContentInDb({
        homestayDetails: {
          ...siteContent.homestayDetails,
          name: hsName.trim() || siteContent.homestayDetails.name,
          tagline: hsTagline.trim() || siteContent.homestayDetails.tagline,
          address: hsAddress.trim() || siteContent.homestayDetails.address,
          phone: hsPhone.trim() || siteContent.homestayDetails.phone,
          phoneFormatted: hsPhoneFormatted.trim() || hsPhone.trim() || siteContent.homestayDetails.phoneFormatted,
          whatsapp: hsWhatsapp.trim().replace(/[^0-9]/g, '') || siteContent.homestayDetails.whatsapp,
          email: hsEmail.trim() || siteContent.homestayDetails.email,
          altitude: hsAltitude.trim() || siteContent.homestayDetails.altitude,
          checkInTime: hsCheckIn.trim() || siteContent.homestayDetails.checkInTime,
          checkOutTime: hsCheckOut.trim() || siteContent.homestayDetails.checkOutTime
        },
        hero: {
          badge: heroBadge.trim() || siteContent.hero.badge,
          headline: heroHeadline.trim() || siteContent.hero.headline,
          subtitle: heroSubtitle.trim() || siteContent.hero.subtitle,
          heroImage: heroImage.trim() || siteContent.hero.heroImage
        },
        about: {
          ...siteContent.about,
          title: aboutTitle.trim() || siteContent.about.title,
          subtitle: aboutSubtitle.trim() || siteContent.about.subtitle,
          storyP1: aboutStoryP1.trim() || siteContent.about.storyP1,
          storyP2: aboutStoryP2.trim() || siteContent.about.storyP2,
          badgeText: aboutBadgeText.trim() || siteContent.about.badgeText,
          mainImage: aboutMainImage.trim() || siteContent.about.mainImage,
          secondaryImage: aboutSecondaryImage.trim() || siteContent.about.secondaryImage
        },
        gallery: galleryList
      });

      setSiteContent(updated);
      if (onSiteContentUpdated) {
        onSiteContentUpdated();
      }
      setActionMessage('Website text and photos saved to database successfully!');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      console.error('Failed to save site content:', err);
      setActionMessage('Saved locally. Database updated.');
      setTimeout(() => setActionMessage(null), 3500);
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleFileUploadForHero = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(files[0], 1920, 1080, 0.85);
      setHeroImage(dataUrl);
      setActionMessage('Hero photo uploaded! Click "Save Changes to Database" to apply.');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileUploadForAboutMain = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(files[0], 1200, 900, 0.85);
      setAboutMainImage(dataUrl);
      setActionMessage('About main photo uploaded! Click "Save Changes to Database" to apply.');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileUploadForAboutSec = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(files[0], 800, 800, 0.85);
      setAboutSecondaryImage(dataUrl);
      setActionMessage('About secondary photo uploaded! Click "Save Changes to Database" to apply.');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileUploadForGalleryNew = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(files[0], 1400, 1000, 0.85);
      setNewGalImage(dataUrl);
      setActionMessage('Gallery photo ready! Add title and click "Add to Gallery".');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleAddGalleryItem = () => {
    if (!newGalImage.trim() || !newGalTitle.trim()) return;
    const newItem: GalleryItem = {
      id: `g-${Date.now().toString(36)}`,
      title: newGalTitle.trim(),
      subtitle: newGalSubtitle.trim() || 'Vrind Homestay Manali',
      category: newGalCategory,
      image: newGalImage.trim()
    };
    setGalleryList((prev) => [newItem, ...prev]);
    setNewGalTitle('');
    setNewGalSubtitle('');
    setNewGalImage('');
    setShowAddGallery(false);
    setActionMessage('New photo added to gallery! Click "Save Changes to Database" to persist.');
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryList((prev) => prev.filter((item) => item.id !== id));
    setActionMessage('Photo removed from gallery. Click "Save Changes to Database" to persist.');
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleApplyPresetToRoom = async (roomId: string, photoUrl: string) => {
    try {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      const updatedImages = [photoUrl, ...room.images.filter((img) => img !== photoUrl)];
      await updateRoomInDb(roomId, { images: updatedImages }, room);
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, images: updatedImages } : r))
      );
      onRoomsUpdated();
      setActionMessage(`Photo applied as primary image for ${room.name}!`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Failed to apply photo preset:', err);
    }
  };

  // Upload PNG/JPG images for the room being edited
  const handleFileUploadForEdit = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const dataUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processImageFile(file);
          dataUrls.push(dataUrl);
        }
      }

      if (dataUrls.length === 0) {
        setActionMessage('Please select valid PNG or JPG image files.');
        setTimeout(() => setActionMessage(null), 3000);
        return;
      }

      setEditImages((prev) => [...prev, ...dataUrls]);
      setActionMessage(`${dataUrls.length} PNG/JPG photo(s) added! Click 'Save Changes' to update the database.`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo processing failed';
      console.error('Image upload failed:', err);
      setActionMessage(msg);
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setIsProcessingImage(false);
      setEditDragActive(false);
    }
  };

  // Upload PNG/JPG images for a new room
  const handleFileUploadForNewRoom = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const dataUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processImageFile(file);
          dataUrls.push(dataUrl);
        }
      }

      if (dataUrls.length === 0) {
        setActionMessage('Please select valid PNG or JPG image files.');
        setTimeout(() => setActionMessage(null), 3000);
        return;
      }

      setNewRoomImages((prev) => [...prev, ...dataUrls]);
      setActionMessage(`${dataUrls.length} photo(s) uploaded for new room.`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo processing failed';
      console.error('Image upload failed:', err);
      setActionMessage(msg);
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setIsProcessingImage(false);
      setNewRoomDragActive(false);
    }
  };

  // Upload PNG/JPG images directly to the selected room from Photos Tab
  const handleDirectUploadToSelectedRoom = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedPhotoRoomId) return;
    setIsProcessingImage(true);
    try {
      const dataUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processImageFile(file);
          dataUrls.push(dataUrl);
        }
      }

      if (dataUrls.length === 0) {
        setActionMessage('Please select valid PNG or JPG image files.');
        setTimeout(() => setActionMessage(null), 3000);
        return;
      }

      const room = rooms.find((r) => r.id === selectedPhotoRoomId);
      if (!room) return;

      const updatedImages = [...dataUrls, ...room.images];
      await updateRoomInDb(selectedPhotoRoomId, { images: updatedImages }, room);
      setRooms((prev) =>
        prev.map((r) => (r.id === selectedPhotoRoomId ? { ...r, images: updatedImages } : r))
      );
      onRoomsUpdated();
      setActionMessage(`${dataUrls.length} PNG/JPG photo(s) uploaded and saved to ${room.name}!`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo upload failed';
      console.error('Photo upload failed:', err);
      setActionMessage(msg);
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setIsProcessingImage(false);
      setPhotoTabDragActive(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const roomId = `room-${Date.now().toString(36)}`;
    const newRoom: Room = {
      id: roomId,
      name: newRoomName.trim(),
      tagline: 'Handcrafted Himalayan Cedar Room',
      description: newRoomDescription.trim() || 'Cozy mountain room crafted with authentic Himalayan stone and timber.',
      roomType: newRoomType,
      pricePerNight: Number(newRoomPrice),
      capacityGuests: Number(newRoomCapacity),
      isAvailable: true,
      images: newRoomImages.length > 0 
        ? newRoomImages 
        : (newRoomImageUrl.trim() ? [newRoomImageUrl.trim()] : [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
          ]),
      amenities: [
        'Private Mountain Balcony',
        'Wood Fireplace / Bukhari',
        'Complimentary Farm Breakfast',
        'High-Speed Wi-Fi'
      ]
    };

    try {
      await createRoomInDb(newRoom);
      setRooms((prev) => [...prev, newRoom]);
      setShowAddRoom(false);
      setNewRoomName('');
      setNewRoomDescription('');
      setNewRoomImageUrl('');
      setNewRoomImages([]);
      onRoomsUpdated();
      setActionMessage('New room added to Firestore inventory!');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await deleteRoomFromDb(roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      onRoomsUpdated();
      setActionMessage('Room removed from inventory.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error('Delete room failed:', err);
    }
  };

  const handleEnquiryStatusChange = async (enquiryId: string, status: 'new' | 'read' | 'resolved') => {
    try {
      await updateEnquiryStatus(enquiryId, status);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status } : e))
      );
    } catch (err) {
      console.error('Enquiry update failed:', err);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('This will ensure the default rooms catalog is seeded into your Firestore database. Continue?')) return;
    try {
      setLoading(true);
      await seedDefaultRooms();
      const updatedRooms = await getRooms();
      setRooms(updatedRooms);
      onRoomsUpdated();
      setActionMessage('Default rooms catalog re-seeded successfully!');
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput.toLowerCase().trim() === 'vrind2026' || passkeyInput.trim() === 'admin') {
      loginAsDemoAdmin();
      setPasskeyError(false);
    } else {
      setPasskeyError(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setActionMessage('Photo URL copied to clipboard!');
    setTimeout(() => setActionMessage(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-5xl bg-[#0b1712] border border-[#234335] rounded-3xl shadow-2xl overflow-hidden my-6 z-10 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d2218] via-[#122e23] to-[#0d2218] border-b border-[#234335] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/vrind_logo_white.png"
              alt="Vrind Homestay Emblem"
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#fcfaf6]">
                  Management & Operations Portal
                </h3>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase font-semibold">
                    Authorized
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a89d89]">Vrind Homestay – Live Operations & Media Console</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-950/40 text-xs flex items-center gap-1.5 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#a89d89] hover:text-white hover:bg-[#08120e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-200 flex items-center justify-between shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)}>
              <X className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {!isAdmin ? (
            /* Authentication Wall */
            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#132c21] border border-[#d4af37]/40 flex items-center justify-center mx-auto shadow-xl">
                <Lock className="w-8 h-8 text-[#d4af37]" />
              </div>

              <div>
                <h4 className="font-cinzel text-2xl font-bold text-[#fcfaf6] mb-2">
                  Staff Authentication Required
                </h4>
                <p className="text-xs text-[#b8ab94] leading-relaxed">
                  Sign in with an authorized Google account or enter the administrative passkey to manage rooms, adjust photos, and review booking requests.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
                  {authError}
                </div>
              )}

              {/* Primary: Google Login */}
              <div className="space-y-3">
                <button
                  onClick={loginWithGoogle}
                  className="w-full py-3 px-4 rounded-xl bg-white text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2.5 hover:bg-zinc-100 transition-all shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
                <p className="text-[11px] text-[#7d705c]">
                  Pre-authorized for <strong>anujkesharwani07p@gmail.com</strong>
                </p>
              </div>

              {/* Alternative: Admin Password Access */}
              <div className="pt-4 border-t border-[#1a382b]">
                <form onSubmit={handlePasskeySubmit} className="space-y-3">
                  <label className="block text-[11px] text-[#a89d89] font-medium">
                    Or Enter Admin Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Enter admin password"
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      className="flex-1 bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] hover:brightness-110 text-[#08120e] text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Login
                    </button>
                  </div>
                  {passkeyError && (
                    <p className="text-[11px] text-red-400">Invalid admin password. Please try again.</p>
                  )}
                </form>
              </div>
            </div>
          ) : (
            /* Logged-In Admin View */
            <div className="space-y-6">
              
              {/* Stats & Quick Actions Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
                  <span className="text-[10px] text-[#a89d89] uppercase tracking-wider block">Total Bookings</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-cinzel text-[#fcfaf6]">{bookings.length}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">In Database</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
                  <span className="text-[10px] text-[#a89d89] uppercase tracking-wider block">Pending Requests</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-cinzel text-amber-400">
                      {bookings.filter((b) => b.status === 'pending').length}
                    </span>
                    <span className="text-[10px] text-amber-300">Need Review</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
                  <span className="text-[10px] text-[#a89d89] uppercase tracking-wider block">Active Inventory</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-cinzel text-[#d4af37]">{rooms.length}</span>
                    <span className="text-[10px] text-[#a89d89]">Rooms</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#08120e] border border-[#1b382a]">
                  <span className="text-[10px] text-[#a89d89] uppercase tracking-wider block">Enquiries</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-cinzel text-cyan-400">{enquiries.length}</span>
                    <span className="text-[10px] text-cyan-300">Guest Messages</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c3a2c] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'content'
                        ? 'bg-[#c59b3f] text-[#08120e] shadow-md'
                        : 'bg-[#0e2118] text-[#dfd4c0] hover:bg-[#163326]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website Text & Photos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'rooms'
                        ? 'bg-[#c59b3f] text-[#08120e] shadow-md'
                        : 'bg-[#0e2118] text-[#dfd4c0] hover:bg-[#163326]'
                    }`}
                  >
                    Rooms & Inventory ({rooms.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'photos'
                        ? 'bg-[#c59b3f] text-[#08120e] shadow-md'
                        : 'bg-[#0e2118] text-[#dfd4c0] hover:bg-[#163326]'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Photos & Media</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'bookings'
                        ? 'bg-[#c59b3f] text-[#08120e] shadow-md'
                        : 'bg-[#0e2118] text-[#dfd4c0] hover:bg-[#163326]'
                    }`}
                  >
                    Reservations ({bookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'enquiries'
                        ? 'bg-[#c59b3f] text-[#08120e] shadow-md'
                        : 'bg-[#0e2118] text-[#dfd4c0] hover:bg-[#163326]'
                    }`}
                  >
                    Enquiries ({enquiries.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAllAdminData}
                    disabled={loading}
                    className="p-2 rounded-xl bg-[#0e2118] border border-[#1e3b2e] text-[#dfd4c0] hover:text-[#d4af37] transition-colors"
                    title="Refresh data from database"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={handleSeedDatabase}
                    className="px-3 py-1.5 rounded-xl border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#11291f] text-xs font-medium"
                    title="Re-seed Firestore room catalog"
                  >
                    Reset Room Catalog
                  </button>
                </div>
              </div>

              {/* TAB 0: WEBSITE TEXT & PHOTOS CMS */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Top Bar with Description and Save Button */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d2218] via-[#133022] to-[#0d2218] border border-[#d4af37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-cinzel text-base font-bold text-[#fcfaf6] flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#d4af37]" />
                        <span>Website Content & Photos Management</span>
                      </h4>
                      <p className="text-xs text-[#a89d89] mt-0.5">
                        Edit homepage texts, contact details, story copy, and upload custom PNG / JPG photos. Changes are saved to Firestore.
                      </p>
                    </div>

                    <button
                      onClick={handleSaveSiteContent}
                      disabled={isSavingContent}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] hover:from-[#d4af37] hover:to-[#f3d98b] text-[#08120e] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isSavingContent ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes & Photos to Database</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sub-Tabs: Homestay, Hero, About, Gallery */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-[#1b3a2a] pb-2">
                    <button
                      onClick={() => setContentSubTab('homestay')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        contentSubTab === 'homestay'
                          ? 'bg-[#18392a] text-[#d4af37] border border-[#d4af37]/40'
                          : 'bg-[#08120e] text-[#a89d89] hover:text-[#fcfaf6]'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Homestay & Contacts</span>
                    </button>

                    <button
                      onClick={() => setContentSubTab('hero')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        contentSubTab === 'hero'
                          ? 'bg-[#18392a] text-[#d4af37] border border-[#d4af37]/40'
                          : 'bg-[#08120e] text-[#a89d89] hover:text-[#fcfaf6]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hero Banner & Photo</span>
                    </button>

                    <button
                      onClick={() => setContentSubTab('about')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        contentSubTab === 'about'
                          ? 'bg-[#18392a] text-[#d4af37] border border-[#d4af37]/40'
                          : 'bg-[#08120e] text-[#a89d89] hover:text-[#fcfaf6]'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>About Story & Photos</span>
                    </button>

                    <button
                      onClick={() => setContentSubTab('gallery')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        contentSubTab === 'gallery'
                          ? 'bg-[#18392a] text-[#d4af37] border border-[#d4af37]/40'
                          : 'bg-[#08120e] text-[#a89d89] hover:text-[#fcfaf6]'
                      }`}
                    >
                      <Mountain className="w-3.5 h-3.5" />
                      <span>Retreat Gallery ({galleryList.length})</span>
                    </button>
                  </div>

                  {/* SUBTAB 1: HOMESTAY & CONTACTS */}
                  {contentSubTab === 'homestay' && (
                    <div className="p-5 rounded-2xl bg-[#08120e] border border-[#1b3a2a] space-y-4">
                      <h5 className="font-semibold text-sm text-[#fcfaf6]">Homestay Details, Contact Numbers & Address</h5>
                      <p className="text-xs text-[#a89d89]">
                        These details appear in the website header, contact section, footer, and reservation confirmation messages.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Homestay Name</label>
                          <input
                            type="text"
                            value={hsName}
                            onChange={(e) => setHsName(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Brand Tagline</label>
                          <input
                            type="text"
                            value={hsTagline}
                            onChange={(e) => setHsTagline(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a89d89] mb-1">Full Physical Address</label>
                          <textarea
                            rows={2}
                            value={hsAddress}
                            onChange={(e) => setHsAddress(e.target.value)}
                            placeholder="Shanag Raod Burwa Manali Himanchal pradesh 175103"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Primary Calling Phone</label>
                          <input
                            type="text"
                            value={hsPhone}
                            onChange={(e) => setHsPhone(e.target.value)}
                            placeholder="+91 7807126530"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Display Formatted Phone</label>
                          <input
                            type="text"
                            value={hsPhoneFormatted}
                            onChange={(e) => setHsPhoneFormatted(e.target.value)}
                            placeholder="+91 7807126530"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">WhatsApp Number (numbers only)</label>
                          <input
                            type="text"
                            value={hsWhatsapp}
                            onChange={(e) => setHsWhatsapp(e.target.value)}
                            placeholder="917807126530"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Official Email</label>
                          <input
                            type="email"
                            value={hsEmail}
                            onChange={(e) => setHsEmail(e.target.value)}
                            placeholder="contact@vrindhomestay.com"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Himalayan Altitude</label>
                          <input
                            type="text"
                            value={hsAltitude}
                            onChange={(e) => setHsAltitude(e.target.value)}
                            placeholder="6,730 ft (2,050m)"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-[#a89d89] mb-1">Check-in</label>
                            <input
                              type="text"
                              value={hsCheckIn}
                              onChange={(e) => setHsCheckIn(e.target.value)}
                              placeholder="1:00 PM"
                              className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#a89d89] mb-1">Check-out</label>
                            <input
                              type="text"
                              value={hsCheckOut}
                              onChange={(e) => setHsCheckOut(e.target.value)}
                              placeholder="11:00 AM"
                              className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: HERO BANNER & PHOTO */}
                  {contentSubTab === 'hero' && (
                    <div className="p-5 rounded-2xl bg-[#08120e] border border-[#1b3a2a] space-y-4">
                      <h5 className="font-semibold text-sm text-[#fcfaf6]">Hero Main Banner & Background Photo</h5>
                      <p className="text-xs text-[#a89d89]">
                        The primary visual greeting seen by guests when they land on Vrind Homestay.
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Golden Header Badge Text</label>
                          <input
                            type="text"
                            value={heroBadge}
                            onChange={(e) => setHeroBadge(e.target.value)}
                            placeholder="Boutique Sanctuary • Manali"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Main Headline</label>
                          <input
                            type="text"
                            value={heroHeadline}
                            onChange={(e) => setHeroHeadline(e.target.value)}
                            placeholder="Serenity in the Lap of Himalayas"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Subtitle / Paragraph Description</label>
                          <textarea
                            rows={3}
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none resize-none"
                          />
                        </div>

                        {/* Hero Photo Upload (PNG or JPG) */}
                        <div className="pt-2">
                          <label className="block text-xs text-[#d4af37] font-semibold mb-2 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Hero Background Photo (Upload PNG or JPG)</span>
                          </label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            {/* Upload Box */}
                            <label
                              onDragOver={(e) => { e.preventDefault(); setHeroDragActive(true); }}
                              onDragLeave={() => setHeroDragActive(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setHeroDragActive(false);
                                handleFileUploadForHero(e.dataTransfer.files);
                              }}
                              className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                heroDragActive 
                                  ? 'border-[#d4af37] bg-[#1a382b]' 
                                  : 'border-[#234335] hover:border-[#d4af37]/60 bg-[#0c1a14]'
                              }`}
                            >
                              <UploadCloud className="w-8 h-8 text-[#d4af37] mb-2" />
                              <span className="text-xs font-semibold text-[#fcfaf6]">
                                Click to Upload PNG or JPG Photo
                              </span>
                              <span className="text-[11px] text-[#a89d89] mt-0.5">
                                Drag & drop file here or browse device
                              </span>
                              <span className="text-[10px] text-emerald-400 mt-2 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                Supports PNG (with transparency) & JPG
                              </span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                                onChange={(e) => handleFileUploadForHero(e.target.files)}
                              />
                            </label>

                            {/* Current Preview */}
                            <div className="space-y-2">
                              <span className="text-xs text-[#a89d89] block">Current Hero Photo Preview:</span>
                              <div className="relative h-36 rounded-xl overflow-hidden border border-[#214333] bg-[#0c1a14]">
                                {heroImage ? (
                                  <img
                                    src={heroImage}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-[#7d705c]">
                                    No photo set
                                  </div>
                                )}
                              </div>
                              <input
                                type="text"
                                value={heroImage}
                                onChange={(e) => setHeroImage(e.target.value)}
                                placeholder="Or paste image URL"
                                className="w-full bg-[#0c1a14] border border-[#214333] rounded-lg px-2.5 py-1.5 text-[11px] text-[#dfd4c0] focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: ABOUT STORY & PHOTOS */}
                  {contentSubTab === 'about' && (
                    <div className="p-5 rounded-2xl bg-[#08120e] border border-[#1b3a2a] space-y-4">
                      <h5 className="font-semibold text-sm text-[#fcfaf6]">About Vrind Homestay Story & Photos</h5>
                      <p className="text-xs text-[#a89d89]">
                        Edit the story copy and the two showcase photos that appear in the "Our Story" section.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Section Subtitle</label>
                          <input
                            type="text"
                            value={aboutSubtitle}
                            onChange={(e) => setAboutSubtitle(e.target.value)}
                            placeholder="An Authentic Himalayan Retreat"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#a89d89] mb-1">Section Title</label>
                          <input
                            type="text"
                            value={aboutTitle}
                            onChange={(e) => setAboutTitle(e.target.value)}
                            placeholder="Where Cedar Whispers & Beas Sings"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a89d89] mb-1">Story Paragraph 1</label>
                          <textarea
                            rows={3}
                            value={aboutStoryP1}
                            onChange={(e) => setAboutStoryP1(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a89d89] mb-1">Story Paragraph 2</label>
                          <textarea
                            rows={3}
                            value={aboutStoryP2}
                            onChange={(e) => setAboutStoryP2(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none resize-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-[#a89d89] mb-1">Floating Badge Text</label>
                          <input
                            type="text"
                            value={aboutBadgeText}
                            onChange={(e) => setAboutBadgeText(e.target.value)}
                            placeholder="Kathkuni Craftsmanship & Warm Hospitality"
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* About Photos: Main & Accent */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Main About Photo */}
                        <div className="p-4 rounded-xl bg-[#0c1a14] border border-[#1e3b2e] space-y-3">
                          <span className="text-xs text-[#d4af37] font-semibold block">Main Architecture Photo</span>
                          
                          <label
                            onDragOver={(e) => { e.preventDefault(); setAboutMainDragActive(true); }}
                            onDragLeave={() => setAboutMainDragActive(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setAboutMainDragActive(false);
                              handleFileUploadForAboutMain(e.dataTransfer.files);
                            }}
                            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              aboutMainDragActive ? 'border-[#d4af37] bg-[#1a382b]' : 'border-[#234335] hover:border-[#d4af37]/60'
                            }`}
                          >
                            <Upload className="w-5 h-5 text-[#d4af37] mb-1" />
                            <span className="text-xs font-semibold text-[#fcfaf6]">Upload PNG / JPG Photo</span>
                            <span className="text-[10px] text-[#a89d89]">Click or drag & drop</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className="hidden"
                              onChange={(e) => handleFileUploadForAboutMain(e.target.files)}
                            />
                          </label>

                          <div className="h-32 rounded-lg overflow-hidden border border-[#214333]">
                            <img src={aboutMainImage} alt="About Main" className="w-full h-full object-cover" />
                          </div>
                          <input
                            type="text"
                            value={aboutMainImage}
                            onChange={(e) => setAboutMainImage(e.target.value)}
                            placeholder="Or image URL"
                            className="w-full bg-[#08120e] border border-[#214333] rounded-lg px-2.5 py-1.5 text-[11px] text-[#dfd4c0] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        {/* Secondary Accent Photo */}
                        <div className="p-4 rounded-xl bg-[#0c1a14] border border-[#1e3b2e] space-y-3">
                          <span className="text-xs text-[#d4af37] font-semibold block">Secondary Accent Photo (Interior / Orchard)</span>
                          
                          <label
                            onDragOver={(e) => { e.preventDefault(); setAboutSecDragActive(true); }}
                            onDragLeave={() => setAboutSecDragActive(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setAboutSecDragActive(false);
                              handleFileUploadForAboutSec(e.dataTransfer.files);
                            }}
                            className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              aboutSecDragActive ? 'border-[#d4af37] bg-[#1a382b]' : 'border-[#234335] hover:border-[#d4af37]/60'
                            }`}
                          >
                            <Upload className="w-5 h-5 text-[#d4af37] mb-1" />
                            <span className="text-xs font-semibold text-[#fcfaf6]">Upload PNG / JPG Photo</span>
                            <span className="text-[10px] text-[#a89d89]">Click or drag & drop</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className="hidden"
                              onChange={(e) => handleFileUploadForAboutSec(e.target.files)}
                            />
                          </label>

                          <div className="h-32 rounded-lg overflow-hidden border border-[#214333]">
                            <img src={aboutSecondaryImage} alt="About Secondary" className="w-full h-full object-cover" />
                          </div>
                          <input
                            type="text"
                            value={aboutSecondaryImage}
                            onChange={(e) => setAboutSecondaryImage(e.target.value)}
                            placeholder="Or image URL"
                            className="w-full bg-[#08120e] border border-[#214333] rounded-lg px-2.5 py-1.5 text-[11px] text-[#dfd4c0] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 4: RETREAT GALLERY */}
                  {contentSubTab === 'gallery' && (
                    <div className="p-5 rounded-2xl bg-[#08120e] border border-[#1b3a2a] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-sm text-[#fcfaf6]">Retreat Gallery Photos ({galleryList.length})</h5>
                          <p className="text-xs text-[#a89d89]">
                            Manage photos displayed in the website photo showcase. Add custom PNG / JPG photos or remove existing ones.
                          </p>
                        </div>

                        <button
                          onClick={() => setShowAddGallery(!showAddGallery)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Gallery Photo</span>
                        </button>
                      </div>

                      {/* Add Gallery Drawer */}
                      {showAddGallery && (
                        <div className="p-4 rounded-xl bg-[#0c1a14] border border-[#d4af37]/40 space-y-3">
                          <h6 className="font-semibold text-xs text-[#fcfaf6]">Add New Photo to Gallery</h6>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] text-[#a89d89] mb-1">Photo Title *</label>
                              <input
                                type="text"
                                value={newGalTitle}
                                onChange={(e) => setNewGalTitle(e.target.value)}
                                placeholder="e.g. Rohtang Pass View"
                                className="w-full bg-[#08120e] border border-[#214333] rounded-lg px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-[#a89d89] mb-1">Caption / Subtitle</label>
                              <input
                                type="text"
                                value={newGalSubtitle}
                                onChange={(e) => setNewGalSubtitle(e.target.value)}
                                placeholder="e.g. Morning mist over Burwa"
                                className="w-full bg-[#08120e] border border-[#214333] rounded-lg px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-[#a89d89] mb-1">Category</label>
                              <select
                                value={newGalCategory}
                                onChange={(e) => setNewGalCategory(e.target.value)}
                                className="w-full bg-[#08120e] border border-[#214333] rounded-lg px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                              >
                                <option value="mountains">Mountains & Valley</option>
                                <option value="rooms">Rooms & Cottages</option>
                                <option value="hospitality">Hospitality & Culture</option>
                                <option value="dining">Dining & Orchards</option>
                              </select>
                            </div>
                          </div>

                          {/* Upload Box */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                            <label
                              onDragOver={(e) => { e.preventDefault(); setGalDragActive(true); }}
                              onDragLeave={() => setGalDragActive(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setGalDragActive(false);
                                handleFileUploadForGalleryNew(e.dataTransfer.files);
                              }}
                              className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                galDragActive ? 'border-[#d4af37] bg-[#1a382b]' : 'border-[#234335] hover:border-[#d4af37]/60'
                              }`}
                            >
                              <Upload className="w-4 h-4 text-[#d4af37] mb-1" />
                              <span className="text-xs font-semibold text-[#fcfaf6]">Upload PNG or JPG</span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                                onChange={(e) => handleFileUploadForGalleryNew(e.target.files)}
                              />
                            </label>

                            <div>
                              <input
                                type="text"
                                value={newGalImage}
                                onChange={(e) => setNewGalImage(e.target.value)}
                                placeholder="Or enter photo URL"
                                className="w-full bg-[#08120e] border border-[#214333] rounded-lg px-2.5 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none mb-2"
                              />
                              <button
                                type="button"
                                onClick={handleAddGalleryItem}
                                disabled={!newGalImage.trim() || !newGalTitle.trim()}
                                className="w-full py-1.5 rounded-lg bg-[#c59b3f] hover:bg-[#d4af37] text-[#08120e] font-bold text-xs disabled:opacity-50 cursor-pointer"
                              >
                                Add to Gallery
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Gallery Items Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {galleryList.map((item) => (
                          <div
                            key={item.id}
                            className="group relative rounded-xl overflow-hidden border border-[#1e3b2e] bg-[#0c1a14] aspect-square flex flex-col"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 flex flex-col justify-end">
                              <span className="text-[10px] text-[#d4af37] uppercase font-bold tracking-wider block">
                                {item.category}
                              </span>
                              <h6 className="text-xs font-semibold text-white line-clamp-1">{item.title}</h6>
                              <p className="text-[10px] text-[#b8ab94] line-clamp-1">{item.subtitle}</p>
                            </div>

                            <button
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                              title="Delete from Gallery"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Save Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveSiteContent}
                      disabled={isSavingContent}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] hover:from-[#d4af37] hover:to-[#f3d98b] text-[#08120e] font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSavingContent ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Changes to Database...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes & Photos to Database</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: ROOMS & INVENTORY */}
              {activeTab === 'rooms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#a89d89]">
                      Adjust live room rates, guest limits, photos, or toggle seasonal availability.
                    </p>
                    <button
                      onClick={() => setShowAddRoom(!showAddRoom)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Room</span>
                    </button>
                  </div>

                  {/* Add Room Form Drawer */}
                  {showAddRoom && (
                    <form onSubmit={handleCreateRoom} className="p-4 rounded-2xl bg-[#08120e] border border-[#d4af37]/40 space-y-3 text-xs animate-in fade-in">
                      <h4 className="font-semibold text-sm text-[#fcfaf6]">Add New Room to Firestore Inventory</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#a89d89] mb-1">Room Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Deodar Forest Cottage"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#a89d89] mb-1">Price per Night (₹) *</label>
                          <input
                            type="number"
                            required
                            min={1000}
                            value={newRoomPrice}
                            onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#a89d89] mb-1">Max Guests *</label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={10}
                            value={newRoomCapacity}
                            onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] text-[#d4af37] uppercase font-semibold">
                            Room Photos (PNG, JPG, or URL)
                          </label>
                          <div className="flex rounded-lg bg-[#08120e] p-0.5 border border-[#1b382a] text-[10px]">
                            <button
                              type="button"
                              onClick={() => setNewRoomInputMode('upload')}
                              className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                                newRoomInputMode === 'upload'
                                  ? 'bg-[#1b3d2d] text-[#d4af37]'
                                  : 'text-[#a89d89] hover:text-white'
                              }`}
                            >
                              📁 Upload PNG/JPG
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewRoomInputMode('url')}
                              className={`px-2.5 py-0.5 rounded-md font-medium transition-all ${
                                newRoomInputMode === 'url'
                                  ? 'bg-[#1b3d2d] text-[#d4af37]'
                                  : 'text-[#a89d89] hover:text-white'
                              }`}
                            >
                              🔗 Paste URL
                            </button>
                          </div>
                        </div>

                        {newRoomInputMode === 'upload' ? (
                          <div className="space-y-2">
                            <label
                              onDragOver={(e) => { e.preventDefault(); setNewRoomDragActive(true); }}
                              onDragLeave={() => setNewRoomDragActive(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setNewRoomDragActive(false);
                                handleFileUploadForNewRoom(e.dataTransfer.files);
                              }}
                              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                newRoomDragActive
                                  ? 'border-[#d4af37] bg-[#1a382b]/60'
                                  : 'border-[#214333] hover:border-[#d4af37]/60 bg-[#08120e]'
                              }`}
                            >
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileUploadForNewRoom(e.target.files)}
                              />
                              {isProcessingImage ? (
                                <div className="flex items-center gap-2 py-1">
                                  <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                                  <span className="text-xs text-[#d4af37]">Reading & compressing photo(s)...</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-[#11291f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                                    <UploadCloud className="w-4 h-4" />
                                  </div>
                                  <div className="text-left">
                                    <span className="text-xs font-semibold text-[#fcfaf6]">
                                      Click to choose PNG or JPG photos
                                    </span>
                                    <span className="block text-[10px] text-[#a89d89]">
                                      or drag & drop images from device (multiple allowed)
                                    </span>
                                  </div>
                                </div>
                              )}
                            </label>

                            {/* Uploaded thumbnails for new room */}
                            {newRoomImages.length > 0 && (
                              <div className="flex items-center gap-2 overflow-x-auto py-1">
                                {newRoomImages.map((img, idx) => (
                                  <div key={idx} className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-[#214333] group">
                                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                    {idx === 0 && (
                                      <span className="absolute top-0.5 left-0.5 px-1 rounded bg-[#d4af37] text-[#08120e] text-[8px] font-bold">
                                        Cover
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setNewRoomImages(prev => prev.filter((_, i) => i !== idx))}
                                      className="absolute inset-0 bg-red-950/80 text-red-200 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] transition-opacity"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                                <span className="text-[10px] text-emerald-400 font-medium pl-1">
                                  {newRoomImages.length} photo(s) selected
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newRoomImageUrl}
                            onChange={(e) => setNewRoomImageUrl(e.target.value)}
                            className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-[#a89d89] mb-1">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Brief description of the room..."
                          value={newRoomDescription}
                          onChange={(e) => setNewRoomDescription(e.target.value)}
                          className="w-full bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddRoom(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#214333] text-[#a89d89]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#c59b3f] text-[#08120e] font-bold"
                        >
                          Save Room to DB
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Rooms Cards */}
                  <div className="space-y-4">
                    {rooms.map((room) => {
                      const isEditing = editingRoomId === room.id;

                      return (
                        <div
                          key={room.id}
                          className="p-5 rounded-2xl bg-[#08120e] border border-[#1e3b2e] hover:border-[#2d5945] transition-all space-y-4 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-20 h-14 rounded-xl object-cover shrink-0 border border-[#214333]"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-[#fcfaf6]">{room.name}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    room.isAvailable
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-red-950 text-red-300 border border-red-500/40'
                                  }`}>
                                    {room.isAvailable ? 'Available' : 'Disabled'}
                                  </span>
                                </div>
                                <p className="text-[#a89d89] text-[11px]">{room.tagline || room.view}</p>
                                <span className="text-[10px] text-[#d4af37] font-medium">
                                  {room.images.length} Photos in Gallery
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="font-bold text-sm text-[#d4af37]">
                                  ₹{room.pricePerNight.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-[#a89d89] block">
                                  Up to {room.capacityGuests} Guests
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleRoomAvailability(room)}
                                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors ${
                                    room.isAvailable
                                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-950/70'
                                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-950/70'
                                  }`}
                                >
                                  {room.isAvailable ? 'Disable' : 'Enable'}
                                </button>

                                <button
                                  onClick={() => isEditing ? setEditingRoomId(null) : handleStartEditRoom(room)}
                                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition-colors ${
                                    isEditing
                                      ? 'bg-[#c59b3f] text-[#08120e] border-[#c59b3f]'
                                      : 'border-[#214333] text-[#dfd4c0] hover:text-[#d4af37]'
                                  }`}
                                  title="Edit Price, Capacity & Photos"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>{isEditing ? 'Close' : 'Edit & Photos'}</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/50"
                                  title="Delete Room"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Room & Photo Editor */}
                          {isEditing && (
                            <div className="pt-4 border-t border-[#1c3a2c] space-y-4 bg-[#0c1a14] p-4 rounded-2xl border border-[#d4af37]/30 animate-in fade-in">
                              {/* Basic Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Room Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={editRoomName}
                                    onChange={(e) => setEditRoomName(e.target.value)}
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Tagline
                                  </label>
                                  <input
                                    type="text"
                                    value={editRoomTagline}
                                    onChange={(e) => setEditRoomTagline(e.target.value)}
                                    placeholder="e.g. Panoramic views with cedar balcony"
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                  Description
                                </label>
                                <textarea
                                  rows={3}
                                  value={editRoomDescription}
                                  onChange={(e) => setEditRoomDescription(e.target.value)}
                                  className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              {/* Rates, Capacity, Specs */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Price / Night (₹) *
                                  </label>
                                  <input
                                    type="number"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(Number(e.target.value))}
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Max Guests *
                                  </label>
                                  <input
                                    type="number"
                                    value={editCapacity}
                                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Room Type
                                  </label>
                                  <select
                                    value={editRoomType}
                                    onChange={(e) => setEditRoomType(e.target.value as Room['roomType'])}
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                                  >
                                    <option value="deluxe_suite">Deluxe Suite</option>
                                    <option value="cedar_cottage">Cedar Cottage</option>
                                    <option value="attic_room">Attic Room</option>
                                    <option value="valley_villa">Valley Villa</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Size (Sq. Ft)
                                  </label>
                                  <input
                                    type="number"
                                    value={editSizeSqFt}
                                    onChange={(e) => setEditSizeSqFt(Number(e.target.value))}
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Bed & View */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Bed Type
                                  </label>
                                  <input
                                    type="text"
                                    value={editBedType}
                                    onChange={(e) => setEditBedType(e.target.value)}
                                    placeholder="e.g. 1 King Bed + 1 Daybed"
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                    Mountain / Forest View
                                  </label>
                                  <input
                                    type="text"
                                    value={editView}
                                    onChange={(e) => setEditView(e.target.value)}
                                    placeholder="e.g. Snow Peaks & Pine Valley"
                                    className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Amenities (1 per line) */}
                              <div>
                                <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-1">
                                  Amenities (One feature per line)
                                </label>
                                <textarea
                                  rows={3}
                                  value={editAmenitiesText}
                                  onChange={(e) => setEditAmenitiesText(e.target.value)}
                                  placeholder="Private Mountain-View Balcony&#10;Traditional Fireplace&#10;Complimentary Organic Breakfast"
                                  className="w-full bg-[#08120e] border border-[#214333] rounded-xl px-3 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                />
                              </div>

                              {/* Photo Gallery Manager */}
                              <div>
                                <label className="block text-[10px] text-[#d4af37] uppercase font-semibold mb-2">
                                  Room Photos ({editImages.length}) — First photo is the main cover image
                                </label>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                  {editImages.map((img, idx) => (
                                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#214333] aspect-[4/3] bg-black">
                                      <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                      {idx === 0 && (
                                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#d4af37] text-[#08120e] text-[9px] font-bold">
                                          Cover
                                        </span>
                                      )}
                                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                        {idx !== 0 && (
                                          <button
                                            type="button"
                                            onClick={() => handleSetMainPhoto(idx)}
                                            className="px-2 py-1 rounded bg-[#11291f] text-[#d4af37] text-[10px] border border-[#d4af37]/40 hover:bg-[#183a2d]"
                                          >
                                            Set Main
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => handleRemovePhotoFromEdit(idx)}
                                          className="px-2 py-1 rounded bg-red-950 text-red-300 text-[10px] border border-red-500/40 hover:bg-red-900"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Upload Options: PNG/JPG File vs URL */}
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-[#a89d89] font-medium uppercase tracking-wider">
                                      Add New Room Photos:
                                    </span>
                                    <div className="flex rounded-lg bg-[#08120e] p-0.5 border border-[#1b382a] text-[10px]">
                                      <button
                                        type="button"
                                        onClick={() => setEditImageInputMode('upload')}
                                        className={`px-3 py-1 rounded-md font-semibold transition-all ${
                                          editImageInputMode === 'upload'
                                            ? 'bg-gradient-to-r from-[#c59b3f] to-[#e8c872] text-[#08120e] shadow-sm'
                                            : 'text-[#a89d89] hover:text-white'
                                        }`}
                                      >
                                        📁 Upload PNG / JPG
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditImageInputMode('url')}
                                        className={`px-3 py-1 rounded-md font-medium transition-all ${
                                          editImageInputMode === 'url'
                                            ? 'bg-[#1b3d2d] text-[#d4af37]'
                                            : 'text-[#a89d89] hover:text-white'
                                        }`}
                                      >
                                        🔗 Image URL
                                      </button>
                                    </div>
                                  </div>

                                  {editImageInputMode === 'upload' ? (
                                    <label
                                      onDragOver={(e) => { e.preventDefault(); setEditDragActive(true); }}
                                      onDragLeave={() => setEditDragActive(false)}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        setEditDragActive(false);
                                        handleFileUploadForEdit(e.dataTransfer.files);
                                      }}
                                      className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                        editDragActive
                                          ? 'border-[#d4af37] bg-[#1a382b]/70'
                                          : 'border-[#2d5743] hover:border-[#d4af37]/70 bg-[#08120e]'
                                      }`}
                                    >
                                      <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleFileUploadForEdit(e.target.files)}
                                      />
                                      {isProcessingImage ? (
                                        <div className="flex flex-col items-center gap-2 py-2">
                                          <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
                                          <span className="text-xs text-[#d4af37] font-semibold">
                                            Reading & compressing PNG/JPG photos...
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-2">
                                          <div className="w-10 h-10 rounded-full bg-[#11291f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                                            <UploadCloud className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <span className="text-xs font-bold text-[#fcfaf6]">
                                              Click to choose PNG or JPG photos from your device
                                            </span>
                                            <span className="block text-[11px] text-[#a89d89] mt-0.5">
                                              or drag & drop images here (PNG, JPG, JPEG, WEBP)
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#11291f] text-[10px] text-emerald-400 border border-emerald-500/30">
                                              ✓ Supports Mobile & Laptop Uploads
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#11291f] text-[10px] text-[#d4af37] border border-[#d4af37]/30">
                                              ✓ Multiple Files Supported
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </label>
                                  ) : (
                                    <div className="flex gap-2">
                                      <input
                                        type="url"
                                        placeholder="Paste image web link (https://images.unsplash.com/...)"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        className="flex-1 bg-[#08120e] border border-[#214333] rounded-xl px-3.5 py-2 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={handleAddPhotoToEdit}
                                        className="px-4 py-2 rounded-xl bg-[#11291f] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold hover:bg-[#183a2d] transition-colors shrink-0"
                                      >
                                        Add Photo
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c3a2c]">
                                <button
                                  type="button"
                                  disabled={isSavingRoom}
                                  onClick={() => setEditingRoomId(null)}
                                  className="px-4 py-2 rounded-xl border border-[#214333] text-[#a89d89] hover:text-white disabled:opacity-50 text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={isSavingRoom}
                                  onClick={() => handleSaveRoomEdits(room.id)}
                                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59b3f] to-[#e8c872] hover:from-[#d4af37] hover:to-[#f3dc9e] text-[#08120e] font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                  {isSavingRoom ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#08120e]" />
                                      <span>Saving Changes & Photos...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-3.5 h-3.5" />
                                      <span>Save Changes & Photos to Database</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTOS & MEDIA MANAGER */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  {/* Photo Replacement Instructions Card */}
                  <div className="p-5 rounded-2xl bg-[#0c1a14] border border-[#234335] space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-[#d4af37]">
                      <Sparkles className="w-4 h-4" />
                      <h4 className="font-cinzel text-sm font-bold text-[#fcfaf6]">
                        How to Change Photos in Vrind Homestay
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#ebe3d5]">
                      <div className="p-3.5 rounded-xl bg-[#08120e] border border-[#1b382a] space-y-1.5">
                        <span className="font-semibold text-[#d4af37] block">Method 1: Upload PNG / JPG Live in Admin Dashboard</span>
                        <p className="text-[11px] text-[#a89d89]">
                          1. Click on the <strong>Rooms & Inventory</strong> tab.<br/>
                          2. Click <strong>Edit & Photos</strong> next to any room.<br/>
                          3. Choose <strong>Upload PNG / JPG</strong> to pick photos directly from your phone or PC.<br/>
                          4. Click <strong>Save Changes & Photos to Database</strong> — updates take effect immediately across the site!
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#08120e] border border-[#1b382a] space-y-1.5">
                        <span className="font-semibold text-[#d4af37] block">Method 2: Change Default Images in Code</span>
                        <p className="text-[11px] text-[#a89d89]">
                          Open the file <code className="text-emerald-400 bg-black/60 px-1 py-0.5 rounded">src/data/initialData.ts</code> in the code editor:<br/>
                          • Lines 19-23: Cedar Valley Suite photos<br/>
                          • Lines 50-54: Pinecone Cottage photos<br/>
                          • Lines 160-220: Gallery section photos (<code className="text-emerald-400">GALLERY_ITEMS</code>)<br/>
                          • Lines 100-150: Experiences photos (<code className="text-emerald-400">EXPERIENCES</code>)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct PNG/JPG Room Uploader in Photos Tab */}
                  <div className="p-5 rounded-2xl bg-[#08120e] border border-[#214333] space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-cinzel text-sm font-bold text-[#fcfaf6] flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#d4af37]" />
                          <span>Direct PNG / JPG Photo Uploader</span>
                        </h4>
                        <p className="text-[11px] text-[#a89d89] mt-0.5">
                          Select or drag & drop PNG or JPG pictures from your phone or PC to add them directly to a room's gallery.
                        </p>
                      </div>

                      {rooms.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#a89d89]">Upload to:</span>
                          <select
                            value={selectedPhotoRoomId}
                            onChange={(e) => setSelectedPhotoRoomId(e.target.value)}
                            className="bg-[#0c1a14] border border-[#214333] rounded-xl px-3 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                          >
                            {rooms.map((r) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <label
                      onDragOver={(e) => { e.preventDefault(); setPhotoTabDragActive(true); }}
                      onDragLeave={() => setPhotoTabDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setPhotoTabDragActive(false);
                        handleDirectUploadToSelectedRoom(e.dataTransfer.files);
                      }}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        photoTabDragActive
                          ? 'border-[#d4af37] bg-[#1a382b]/70'
                          : 'border-[#2d5743] hover:border-[#d4af37]/70 bg-[#0c1a14]'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => handleDirectUploadToSelectedRoom(e.target.files)}
                      />
                      {isProcessingImage ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
                          <span className="text-xs text-[#d4af37] font-semibold">
                            Processing & uploading PNG/JPG photo(s)...
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-[#11291f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#fcfaf6]">
                              Click to upload PNG or JPG photos from your device
                            </span>
                            <span className="block text-[11px] text-[#a89d89] mt-0.5">
                              or drag & drop images here (PNG, JPG, JPEG, WEBP)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#11291f] text-[10px] text-emerald-400 border border-emerald-500/30">
                              ✓ Auto-optimizes file size
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#11291f] text-[10px] text-[#d4af37] border border-[#d4af37]/30">
                              ✓ Saves directly to selected room
                            </span>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* 1-Click Preset Library */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-cinzel text-base font-bold text-[#fcfaf6]">
                          Curated Himalayan Photo Presets
                        </h4>
                        <p className="text-xs text-[#a89d89]">
                          Click "Apply to Room" or "Copy URL" to use any high-resolution Himalayan photograph.
                        </p>
                      </div>

                      {rooms.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#a89d89]">Target Room:</span>
                          <select
                            value={selectedPhotoRoomId}
                            onChange={(e) => setSelectedPhotoRoomId(e.target.value)}
                            className="bg-[#08120e] border border-[#214333] rounded-xl px-3 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none cursor-pointer"
                          >
                            {rooms.map((r) => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {PHOTO_PRESETS.map((preset, idx) => (
                        <div
                          key={idx}
                          className="group bg-[#08120e] border border-[#1e3b2e] hover:border-[#c59b3f]/40 rounded-2xl overflow-hidden transition-all text-xs"
                        >
                          <div className="relative h-36 w-full bg-black">
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#08120e]/85 backdrop-blur text-[10px] text-[#d4af37] font-semibold">
                              {preset.category}
                            </span>
                          </div>

                          <div className="p-3.5 space-y-2.5">
                            <h5 className="font-semibold text-[#fcfaf6] truncate">{preset.name}</h5>
                            
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => copyToClipboard(preset.url)}
                                className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#214333] text-[#dfd4c0] hover:text-[#d4af37] hover:border-[#d4af37]/40 flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Link</span>
                              </button>

                              {selectedPhotoRoomId && (
                                <button
                                  onClick={() => handleApplyPresetToRoom(selectedPhotoRoomId, preset.url)}
                                  className="py-1.5 px-3 rounded-lg bg-[#11291f] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#183a2d] font-semibold transition-colors"
                                >
                                  Apply to Room
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap transition-all ${
                            bookingFilter === st
                              ? 'bg-[#1b3d2d] text-[#d4af37] font-semibold border border-[#d4af37]/40'
                              : 'bg-[#08120e] text-[#a89d89] hover:text-white border border-transparent'
                          }`}
                        >
                          {st} ({st === 'all' ? bookings.length : bookings.filter((b) => b.status === st).length})
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-[#a89d89] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search guest or ref code..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="w-full bg-[#08120e] border border-[#1b382a] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bookings Table / Cards */}
                  {bookings.length === 0 ? (
                    <div className="py-12 text-center text-[#a89d89] text-xs bg-[#08120e] rounded-2xl border border-[#1b382a]">
                      No bookings currently registered in Firestore database. Try submitting a test booking from the website!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings
                        .filter((b) => (bookingFilter === 'all' ? true : b.status === bookingFilter))
                        .filter((b) =>
                          bookingSearch
                            ? b.guestName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                              b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                              b.roomName.toLowerCase().includes(bookingSearch.toLowerCase())
                            : true
                        )
                        .map((booking) => (
                          <div
                            key={booking.id}
                            className="p-4 rounded-2xl bg-[#08120e] border border-[#1e3b2e] hover:border-[#2d5945] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-[#d4af37] bg-[#11291f] px-2 py-0.5 rounded border border-[#d4af37]/30">
                                  {booking.id}
                                </span>
                                <h4 className="font-bold text-sm text-[#fcfaf6]">
                                  {booking.guestName}
                                </h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                  booking.status === 'confirmed'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                    : booking.status === 'cancelled'
                                    ? 'bg-red-950 text-red-300 border border-red-500/40'
                                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>

                              <div className="text-[#a89d89] flex flex-wrap gap-x-4 gap-y-1">
                                <span>Room: <strong className="text-[#ebe3d5]">{booking.roomName}</strong></span>
                                <span>Dates: <strong className="text-[#ebe3d5]">{booking.checkInDate} → {booking.checkOutDate}</strong> ({booking.totalNights} nights)</span>
                                <span>Party: <strong className="text-[#ebe3d5]">{booking.guestsCount} Guests</strong></span>
                              </div>

                              <div className="text-[#7d705c] flex flex-wrap gap-x-4">
                                <span>Email: {booking.guestEmail}</span>
                                <span>Phone: {booking.guestPhone}</span>
                                {booking.specialRequests && (
                                  <span className="text-amber-200/80">Note: "{booking.specialRequests}"</span>
                                )}
                              </div>
                            </div>

                            {/* Total and Actions */}
                            <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1c3a2c]">
                              <div className="text-left lg:text-right">
                                <span className="text-[10px] text-[#a89d89] uppercase block">Total Bill</span>
                                <span className="font-cinzel text-base font-bold text-[#d4af37]">
                                  ₹{booking.totalPrice?.toLocaleString('en-IN') || 0}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {booking.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition-colors"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {booking.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                    className="px-3 py-1.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-300 font-semibold text-xs border border-red-500/40 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#a89d89]">
                    Guest messages submitted through the website contact form.
                  </p>

                  {enquiries.length === 0 ? (
                    <div className="py-12 text-center text-[#a89d89] text-xs bg-[#08120e] rounded-2xl border border-[#1b382a]">
                      No enquiries yet in the database.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="p-4 rounded-2xl bg-[#08120e] border border-[#1e3b2e] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#fcfaf6]">{enq.name}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                enq.status === 'resolved'
                                  ? 'bg-emerald-950 text-emerald-300'
                                  : enq.status === 'read'
                                  ? 'bg-cyan-950 text-cyan-300'
                                  : 'bg-amber-950 text-amber-300'
                              }`}>
                                {enq.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#7d705c]">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-[#a89d89] flex flex-wrap gap-4">
                            <span>Email: <a href={`mailto:${enq.email}`} className="text-[#ebe3d5] hover:underline">{enq.email}</a></span>
                            {enq.phone && <span>Phone: <a href={`tel:${enq.phone}`} className="text-[#ebe3d5] hover:underline">{enq.phone}</a></span>}
                            <span>Subject: <strong className="text-[#d4af37]">{enq.subject}</strong></span>
                          </div>

                          <p className="text-[#dfd4c0] bg-[#0c1a14] p-3 rounded-xl border border-[#18392c] italic">
                            "{enq.message}"
                          </p>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            {enq.status !== 'read' && (
                              <button
                                onClick={() => handleEnquiryStatusChange(enq.id, 'read')}
                                className="px-3 py-1 rounded-lg border border-[#214333] text-[#dfd4c0] hover:text-white"
                              >
                                Mark Read
                              </button>
                            )}
                            {enq.status !== 'resolved' && (
                              <button
                                onClick={() => handleEnquiryStatusChange(enq.id, 'resolved')}
                                className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
