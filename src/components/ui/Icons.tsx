import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </svg>
);
export const BookIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    <path d="M12 3v15" />
  </svg>
);
export const BookOpenIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 6.5c-1.5-1.5-4-2-8-2v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2Z" />
    <path d="M12 6.5v13" />
  </svg>
);
export const ExamIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="3" width="16" height="18" rx="3" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);
export const ClipboardCheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 3.5h6v2H9z" />
    <path d="m8.5 13 2.5 2.5 4.5-4.5" />
  </svg>
);
export const TeacherIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M9 20h6M12 16v4" />
    <circle cx="12" cy="9" r="2" />
    <path d="M8.5 13.5c.7-1.4 2-2 3.5-2s2.8.6 3.5 2" />
  </svg>
);
export const SettingsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);
export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4-4" />
  </svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ChevronUpIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 15 6-6 6 6" />
  </svg>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const EyeOffIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8M6.6 6.6C4 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.6 0 3-.4 4.2-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);
export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M7 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);
export const StarIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
  </svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20c0-3-2-5.2-4.5-5.8" />
  </svg>
);
export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
);
export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 3h3l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5a2 2 0 0 1 2-2Z" />
  </svg>
);
export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const GraduationIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
    <path d="M6.5 11v4.5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3V11M21.5 9v5" />
  </svg>
);
export const WalletIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="14" rx="2.5" />
    <path d="M3 10h18M7 6V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V6" />
  </svg>
);
export const BriefcaseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" />
  </svg>
);
export const CheckCircleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);
export const CheckCircleSolidIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm-1.2 13.4-3.6-3.6 1.4-1.4 2.2 2.2 5-5 1.4 1.4-6.4 6.4Z" />
  </svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ExpandIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
export const ShrinkIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
  </svg>
);
export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);
export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v12M7 11l5 5 5-5" />
    <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
  </svg>
);
export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
);
export const FileIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
export const LibraryIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="4" height="16" rx="1" />
    <rect x="9" y="4" width="4" height="16" rx="1" />
    <path d="m15.5 5.2 3.8-1 3 14.6-3.8 1z" />
  </svg>
);
export const ImageIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <circle cx="9" cy="9.5" r="1.8" />
    <path d="m21 16-5-5-9 9" />
  </svg>
);
export const FileCheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 14.5l2 2 4-4" />
  </svg>
);
export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
export const LogoutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </svg>
);
export const GlobeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
  </svg>
);
export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="10" width="14" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
export const PaperPlaneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m21 3-9.5 9.5M21 3l-6 18-3.5-8.5L3 9l18-6Z" />
  </svg>
);
export const QuoteIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6a1 1 0 0 1 1-1h3V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-4a1 1 0 0 1 1-1h3V7Z" />
  </svg>
);
export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    <path d="m13.5 8.5 3 3" />
  </svg>
);
export const VideoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="13" height="12" rx="2.5" />
    <path d="m16 10 5-3v10l-5-3" />
  </svg>
);
export const ListIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
export const LayersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" />
  </svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const TriangleIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 4 21 20H3L12 4Z" />
  </svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const SwirlIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 5.5a5.5 5.5 0 1 0 0 11 3.8 3.8 0 1 0 0-7.6 2.2 2.2 0 1 0 0 4.4" />
  </svg>
);
export const AwardIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m8.5 13.5-1.5 7 5-3 5 3-1.5-7" />
  </svg>
);
export const CrownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z" />
  </svg>
);
export const TargetIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

/** Google brand mark (multi-color). */
export const GoogleIcon = ({ size = 20, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);
