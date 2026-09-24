import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Award, Download, ArrowUpRight, GraduationCap } from 'lucide-react';
import { getVerifiedUserId } from '@/lib/supabase/server';
import { getUserCertificates } from '@/lib/data/certificates';
import { formatDate } from '@/lib/utils/format';

export default async function CertificatesPage() {
  // Middleware already verified the session for this route and forwarded the id.
  const userId = getVerifiedUserId();
  const user = userId ? { id: userId } : null;
  if (!user) redirect('/auth/login?next=/dashboard/certificates');

  const certificates = await getUserCertificates(user.id);

  if (certificates.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-[220px] w-[220px] rounded-full border border-[#ff7a3d]/25 opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,122,61,.35) 1px, transparent 1.5px)', backgroundSize: '12px 12px' }}
        />
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a3d] text-white">
          <Award className="h-7 w-7" />
        </span>
        <h2 className="relative mt-6 font-display text-[24px] font-medium leading-tight text-black sm:text-[28px]">
          Aucun certificat pour le moment
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-[14px] font-medium leading-[1.6] text-black/60">
          Terminez une formation pour obtenir votre premier certificat.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/my-courses"
            className="group inline-flex h-[44px] items-center gap-2 bg-black px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
          >
            Voir mes cours
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
          <Link
            href="/courses"
            className="inline-flex h-[44px] items-center px-6 text-[13px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
          >
            Explorer les formations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {certificates.map((cert) => (
        <article key={cert.id} className="group relative flex flex-col overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div className="relative overflow-hidden bg-[#ff7a3d] px-6 pb-6 pt-7 text-white">
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -right-10 h-[170px] w-[170px] rounded-full border border-white/35 opacity-70 transition-transform duration-700 group-hover:-translate-y-2"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.62) 1px, transparent 1.5px)', backgroundSize: '10px 10px' }}
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#ff7a3d]">
              <Award className="h-5 w-5" />
            </span>
            <p className="relative mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">Certificat CIPRESA</p>
            <h3 className="relative mt-1.5 line-clamp-2 font-display text-[20px] font-medium leading-[1.1]">{cert.courseTitle}</h3>
          </div>
          <div className="flex flex-1 flex-col px-6 py-5">
            <p className="flex items-center gap-2 text-[12px] font-medium text-black/55">
              <GraduationCap className="h-4 w-4 text-[#ff7a3d]" />
              Délivré le {formatDate(cert.issuedAt, 'long')}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              {cert.certificateUrl && (
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[38px] items-center gap-2 bg-black px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#ff7a3d]"
                >
                  <Download className="h-4 w-4" /> Télécharger
                </a>
              )}
              <Link
                href={`/course/${cert.courseSlug}`}
                className="inline-flex h-[38px] items-center gap-1.5 px-4 text-[12px] font-semibold text-black ring-1 ring-black/15 transition-colors hover:bg-[#f6f5f2]"
              >
                Voir le cours
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
