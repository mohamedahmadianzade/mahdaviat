import { motion } from 'framer-motion';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  FolderKanban,
  ScrollText,
  Trophy,
  Link2,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import type { OrgMember, OrgUnit } from '../../types';
import { managementLevelLabels, managementLevelStyles } from '../../types';

interface OrgPersonProfileProps {
  member: OrgMember;
  unit: OrgUnit | null;
  onBack: () => void;
}

interface ListSectionProps {
  icon: typeof Briefcase;
  title: string;
  items: string[];
}

function ListSection({ icon: Icon, title, items }: ListSectionProps) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-emerald-deep">
        <Icon className="h-4 w-4 text-emerald" />
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-light" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OrgPersonProfile({ member, unit, onBack }: OrgPersonProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button onClick={onBack} className="btn-ghost mb-6">
        <ArrowRight className="h-4 w-4" />
        بازگشت به چارت سازمانی
      </button>

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-emerald/10 bg-gradient-to-br from-emerald-deep to-emerald shadow-card">
        <div className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
          {/* Image */}
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-lg">
            {member.image ? (
              <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/50">
                <Sparkles className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-right">
            <h1 className="mb-1 font-display text-2xl font-bold text-white">{member.name}</h1>
            <p className="mb-2 text-sm text-emerald-soft">{member.position}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  managementLevelStyles[member.managementLevel] ?? 'bg-white/20 text-white'
                }`}
              >
                {managementLevelLabels[member.managementLevel] ?? member.managementLevel}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                {member.department}
              </span>
              {unit && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  {unit.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - contact info */}
        <div className="space-y-4 lg:col-span-1">
          {/* Bio */}
          {member.bio && (
            <div className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-soft">
              <h4 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-emerald-deep">
                <BookOpen className="h-4 w-4 text-emerald" />
                درباره
              </h4>
              <p className="text-sm leading-relaxed text-muted">{member.bio}</p>
            </div>
          )}

          {/* Contact */}
          <div className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-soft">
            <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-emerald-deep">
              <Phone className="h-4 w-4 text-emerald" />
              راه‌های ارتباطی
            </h4>
            <div className="space-y-3">
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-emerald-deep"
                >
                  <Phone className="h-4 w-4 text-emerald-light" />
                  <span dir="ltr">{member.phone}</span>
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-emerald-deep"
                >
                  <Mail className="h-4 w-4 text-emerald-light" />
                  <span dir="ltr">{member.email}</span>
                </a>
              )}
              {member.office && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <MapPin className="h-4 w-4 text-emerald-light" />
                  <span>{member.office}</span>
                </div>
              )}
            </div>

            {/* Social links */}
            {member.socialLinks.length > 0 && (
              <div className="mt-4 border-t border-emerald/10 pt-3">
                <div className="mb-2 flex items-center gap-2 text-xs text-mutedLight">
                  <Link2 className="h-3.5 w-3.5" />
                  شبکه‌های اجتماعی
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-emerald/15 bg-emerald-soft/50 px-3 py-1.5 text-xs text-emerald-deep transition-colors hover:bg-emerald-soft"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - detailed sections */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <ListSection icon={Briefcase} title="مسئولیت‌ها" items={member.responsibilities} />
            <ListSection icon={GraduationCap} title="تحصیلات" items={member.education} />
            <ListSection icon={Briefcase} title="سوابق کاری" items={member.experience} />
            <ListSection icon={Sparkles} title="مهارت‌ها" items={member.skills} />
            <ListSection icon={BookOpen} title="حوزه‌های پژوهشی" items={member.researchAreas} />
            <ListSection icon={ScrollText} title="انتشارات" items={member.publications} />
            <ListSection icon={FolderKanban} title="پروژه‌ها" items={member.projects} />
            <ListSection icon={Award} title="گواهینامه‌ها" items={member.certificates} />
            <ListSection icon={Trophy} title="افتخارات" items={member.awards} />
          </div>

          {/* Gallery */}
          {member.gallery.length > 0 && (
            <div className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-soft">
              <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-emerald-deep">
                <ImageIcon className="h-4 w-4 text-emerald" />
                گالری تصاویر
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {member.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-xl border border-emerald/10 bg-cream"
                  >
                    <img src={img} alt={`گالری ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
