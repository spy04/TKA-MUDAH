import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Lock,
  Play,
  Star,
  Volume2,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const lessons = [
  { title: 'Konsep suhu & tekanan', complete: true },
  { title: 'Hukum Termodinamika I', complete: true },
  { title: 'Gas ideal & siklus Carnot', active: true },
  { title: 'Entropi & mesin pendingin', locked: true },
]

export default function LandingHero() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-[#eef4fb] via-white to-white pb-20 pt-12 lg:pb-32 lg:pt-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-52 left-1/2 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute left-[-12rem] top-[28rem] h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 text-center lg:px-8">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0b1f3a] shadow-sm ring-1 ring-slate-100">
          <span>✨ Platform Belajar Online untuk Generasi Hebat</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-blue-800">
            SD · SMP · SMA
          </span>
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#0b1f3a] md:text-5xl lg:text-6xl">
          Belajar Lebih Mudah,
          <span className="mt-2 block text-[#40608b]">Raih Prestasi Lebih Tinggi.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">
          Pelajari materi sekolah, tonton video pembelajaran interaktif, kerjakan
          latihan soal, dan siapkan ujian dalam satu ruang belajar yang terarah.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#40608b] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#0b1f3a]"
          >
            Mulai Belajar Gratis <ChevronRight size={18} />
          </Link>
          <a
            href="#katalog"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#0b1f3a] shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-50"
          >
            <Play size={17} className="fill-[#40608b] text-[#40608b]" /> Jelajahi Materi
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5"><span className="flex text-amber-400"><Star size={15} className="fill-current" /><Star size={15} className="fill-current" /><Star size={15} className="fill-current" /><Star size={15} className="fill-current" /><Star size={15} className="fill-current" /></span><b className="text-[#0b1f3a]">4.9/5</b> Rating siswa</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span className="inline-flex items-center gap-1.5"><BookOpen size={16} className="text-[#40608b]" /><b className="text-[#0b1f3a]">10.000+ modul</b> pembelajaran</span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span className="inline-flex items-center gap-1.5"><BadgeCheck size={16} className="text-emerald-600" /><b className="text-[#0b1f3a]">Akses gratis</b> kapan saja</span>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl text-left">
          <div className="absolute -left-5 -top-7 z-10 hidden items-center gap-3 rounded-xl bg-white p-3 shadow-xl shadow-slate-900/10 md:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600"><Flame size={22} /></span>
            <span><small className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Streak belajar</small><b className="text-sm text-[#0b1f3a]">5 hari berturut-turut</b></span>
          </div>
          <div className="absolute -right-4 -top-8 z-10 hidden items-center gap-3 rounded-xl bg-white p-3 shadow-xl shadow-slate-900/10 md:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-800">84</span>
            <span><small className="block text-[10px] font-bold text-emerald-600">↑ DI ATAS RATA-RATA</small><b className="text-sm text-[#0b1f3a]">Skor Try Out CBT</b></span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <div className="flex items-center justify-between bg-slate-100 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="ml-2 text-[11px] font-medium text-slate-500">TKA Mudah Studio · SMA Kelas 11</span></div>
              <span className="hidden items-center gap-1 text-[11px] text-slate-500 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" />HD 1080p</span>
            </div>

            <div className="grid lg:grid-cols-12">
              <div className="relative flex aspect-video flex-col justify-between bg-gradient-to-br from-[#061329] via-[#0b1f3a] to-[#40608b] p-4 text-white lg:col-span-8 sm:p-6">
                <div className="flex items-start justify-between gap-3"><span className="rounded-md bg-black/25 px-3 py-1.5 text-[11px] font-medium">Modul 3: Hukum Gas Ideal & Siklus Carnot</span><span className="rounded-md bg-[#40608b] px-2 py-1.5 text-[10px] font-bold">PREVIEW VIDEO</span></div>
                <div className="mx-auto text-center"><button type="button" aria-label="Preview video pembelajaran" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-lg ring-8 ring-white/5 transition hover:scale-105 hover:bg-white/30"><Play size={32} className="ml-1 fill-white" /></button><p className="mt-4 text-sm font-semibold">Belajar konsep termodinamika</p><p className="mt-1 text-xs text-blue-100">Video pembelajaran interaktif</p></div>
                <div><div className="h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[48%] rounded-full bg-blue-300" /></div><div className="mt-2 flex items-center justify-between text-[11px] text-white/80"><span className="flex items-center gap-1.5"><Volume2 size={14} />06:45 / 14:20</span><span>⚙ ⛶</span></div></div>
              </div>

              <div className="bg-white p-5 lg:col-span-4">
                <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-[#40608b]">Silabus Bab 4</span><span className="text-[11px] text-slate-500">3 dari 5 video</span></div>
                <h2 className="mt-2 text-base font-bold text-[#0b1f3a]">Termodinamika & Energi</h2>
                <div className="mt-3 space-y-2">{lessons.map((lesson) => <div key={lesson.title} className={`flex items-center gap-2 rounded-lg p-2 text-xs ${lesson.active ? 'bg-blue-100 text-blue-900' : lesson.complete ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-500'}`}>{lesson.complete ? <CheckCircle2 size={15} className="text-emerald-600" /> : lesson.active ? <Play size={15} className="fill-[#40608b] text-[#40608b]" /> : <Lock size={14} />}<span className="truncate">{lesson.title}</span></div>)}</div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3"><span className="flex items-center gap-2 text-xs"><BarChart3 size={17} className="text-[#40608b]" /><span><b className="block text-[#0b1f3a]">Kuis kilat Bab 4</b><small className="text-slate-500">10 soal prediktif</small></span></span><span className="rounded-md bg-[#40608b] px-2 py-1 text-[10px] font-bold text-white">Mulai</span></div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-7 z-10 hidden max-w-[15rem] items-center gap-3 rounded-xl bg-white p-3 shadow-xl shadow-slate-900/10 lg:flex"><BarChart3 size={25} className="text-[#40608b]" /><span className="flex-1"><span className="flex justify-between text-[11px] font-bold text-[#0b1f3a]"><span>Progres Fisika</span><span className="text-[#40608b]">75%</span></span><span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-3/4 rounded-full bg-[#40608b]" /></span></span></div>
        </div>
      </div>
    </section>
  )
}
