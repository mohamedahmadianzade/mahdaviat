import { motion } from 'framer-motion';
import {
  ArrowRight, Phone, Mail, MapPin, Briefcase, GraduationCap,
  BookOpen, Target, FolderKanban, BadgeCheck, Trophy, Sparkles, Link2, Image, FileText,
} from 'lucide-react';
import type { OrgMember, OrgUnit } from '../../types';
import { managementLevelLabels, managementLevelStyles } from '../../types';

interface OrgPersonProfileProps {
  member: OrgMember;
  unit?: OrgUnit;
  onBack: () => void;
}

function Section({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-emerald/10 bg-white/70 p-5 shadow-soft"
    >
      <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-emerald-deep">
        <span className="text-emerald">{icon}</span>
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function ListItems({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-sm text-mutedLight">اطلاعاتی ثبت نشده است.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-muted">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function TagList({ items, color = 'emerald' }: { items: string[]; color?: 'emerald' | 'gold' }) {
  if (!items.length) return <p className="text-sm text-mutedLight">اطلاعاتی ثبت نشده است.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`rounded-full border px-3 py-1 text-xs ${color === 'emerald' ? 'border-emerald/15 bg-emerald-soft/60 text-emerald-deep' : 'border-gold/30 bg-gold-soft/40 text-gold-deep'}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

export default function OrgPersonProfile({ member, unit, onBack }: OrgPersonProfileProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} className="group mb-6 inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-white/60 px-4 py-2 text-sm text-emerald-deep transition-all hover:bg-emerald-soft">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />بازگشت به ساختار سازمانی
      </button>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl border border-emerald/10 bg-white shadow-card"
      >
        <div className="h-24 bg-gradient-to-l from-emerald to-emerald-deep" />
        <div className="px-6 pb-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end">
            <div className="-mt-12 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-emerald-soft shadow-card">
              {member.image ? (
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-emerald">{member.name.charAt(0)}</div>
              )}
            </div>
            <div className="flex-1 pt-2">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${managementLevelStyles[member.managementLevel]}`}>
                  {managementLevelLabels[member.managementLevel]}
                </span>
                {unit && <span className="inline-flex items-center rounded-full bg-emerald-soft px-3 py-1 text-xs font-medium text-emerald-deep">{unit.name}</span>}
              </div>
              <h1 className="font-display text-2xl font-bold text-emerald-deep sm:text-3xl">{member.name}</h1>
              <p className="mt-1 text-sm text-muted">{member.position}</p>
              <p className="text-sm text-mutedLight">{member.department}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bio + Contact row */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {member.bio && (
            <Section icon={<BookOpen className="h-4 w-4" />} title="زندگی‌نامه" delay={0.05}>
              <p className="text-sm leading-loose text-muted">{member.bio}</p>
            </Section>
          )}
        </div>
        <Section icon={<Phone className="h-4 w-4" />} title="اطلاعات تماس" delay={0.1}>
          <div className="space-y-3">
            {member.phone && <div className="flex items-center gap-2.5 text-sm text-muted"><Phone className="h-4 w-4 text-emerald" /><span dir="ltr">{member.phone}</span></div>}
            {member.email && <div className="flex items-center gap-2.5 text-sm text-muted"><Mail className="h-4 w-4 text-emerald" /><a href={`mailto:${member.email}`} className="hover:text-emerald" dir="ltr">{member.email}</a></div>}
            {member.office && <div className="flex items-center gap-2.5 text-sm text-muted"><MapPin className="h-4 w-4 text-emerald" /><span>{member.office}</span></div>}
            {member.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {member.socialLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/15 bg-emerald-soft/50 px-3 py-1.5 text-xs text-emerald-deep transition-all hover:bg-emerald hover:text-white">
                    <Link2 className="h-3 w-3" />{link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* Responsibilities + Education */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section icon={<Target className="h-4 w-4" />} title="مسئولیت‌ها" delay={0.15}>
          <ListItems items={member.responsibilities} />
        </Section>
        <Section icon={<GraduationCap className="h-4 w-4" />} title="تحصیلات" delay={0.2}>
          <ListItems items={member.education} />
        </Section>
      </div>

      {/* Experience + Skills */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section icon={<Briefcase className="h-4 w-4" />} title="سوابق حرفه‌ای" delay={0.25}>
          <ListItems items={member.experience} />
        </Section>
        <Section icon={<Sparkles className="h-4 w-4" />} title="مهارت‌ها" delay={0.3}>
          <TagList items={member.skills} color="emerald" />
        </Section>
      </div>

      {/* Research + Publications */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section icon={<BookOpen className="h-4 w-4" />} title="حوزه‌های پژوهشی" delay={0.35}>
          <TagList items={member.researchAreas} color="gold" />
        </Section>
        <Section icon={<FileText className="h-4 w-4" />} title="انتشارات" delay={0.4}>
          <ListItems items={member.publications} />
        </Section>
      </div>

      {/* Projects + Certificates */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section icon={<FolderKanban className="h-4 w-4" />} title="پروژه‌ها" delay={0.45}>
          <ListItems items={member.projects} />
        </Section>
        <Section icon={<BadgeCheck className="h-4 w-4" />} title="گواهینامه‌ها" delay={0.5}>
          <ListItems items={member.certificates} />
        </Section>
      </div>

      {/* Awards */}
      {member.awards.length > 0 && (
        <div className="mt-5">
          <Section icon={<Trophy className="h-4 w-4" />} title="افتخارات و جوایز" delay={0.55}>
            <ListItems items={member.awards} />
          </Section>
        </div>
      )}

      {/* Gallery */}
      {member.gallery.length > 0 && (
        <div className="mt-5">
          <Section icon={<Image className="h-4 w-4" />} title="گالری" delay={0.6}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {member.gallery.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl border border-emerald/10 bg-cream">
                  <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Documents */}
      {member.documents.length > 0 && (
        <div className="mt-5">
          <Section icon={<FileText className="h-4 w-4" />} title="اسناد" delay={0.65}>
            <div className="space-y-2">
              {member.documents.map((doc, i) => (
                <a key={i} href={doc} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl border border-emerald/10 bg-emerald-soft/30 px-4 py-3 text-sm text-emerald-deep transition-all hover:bg-emerald-soft">
                  <FileText className="h-4 w-4 text-emerald" />
                  سند {i + 1}
                </a>
              ))}
            </div>
          </Section>
        </div>
      )}
    </motion.div>
  );
}
