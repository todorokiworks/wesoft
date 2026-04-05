import "../css/subpage.less";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDataBaseUrl, getImageUrl } from "../config";
import SkeletonView from "../common/SkeletonView";
import SubpageTitle from "../common/SubpageTitle";
import * as JobEntity from "../entities/Jobs";
import FaqStickyLink from "../common/FaqStickyLink";

function recruitImageForTitle(title: string): string {
  if (title.includes("エンジニア")) {
    return "/image/img_recruit_engineer.png";
  }
  if (title.includes("プロジェクト")) {
    return "/image/img_recruit_pj.png";
  }
  if (title.includes("営業")) {
    return "/image/img_recruit_sales.png";
  }
  return "/image/img_recruit_mv.png";
}

function altForRecruitTitle(title: string): string {
  if (title.includes("エンジニア")) {
    return "サーバールームでラップトップを持つエンジニアの写真";
  }
  if (title.includes("プロジェクト")) {
    return "ノートパソコンを持つプロジェクト担当の写真";
  }
  if (title.includes("営業")) {
    return "オフィスでラップトップの前にいる営業職の写真";
  }
  return "採用メインビジュアル";
}

/** 表示順: PM → エンジニア → 営業 */
function sortJobsForDisplay(jobs: JobEntity.Job[]): JobEntity.Job[] {
  const keys = ["プロジェクト", "エンジニア", "営業"] as const;
  const rank = (t: string) => {
    const i = keys.findIndex((k) => t.includes(k));
    return i === -1 ? keys.length : i;
  };
  return [...jobs].sort((a, b) => rank(a.title) - rank(b.title));
}

function recruitSectionId(title: string): string {
  if (title.includes("エンジニア")) {
    return "recruit-engineer";
  }
  if (title.includes("プロジェクト")) {
    return "recruit-pm";
  }
  if (title.includes("営業")) {
    return "recruit-sales";
  }
  return "recruit-section";
}

const RECRUIT_MV_NAV = [
  {
    hash: "#recruit-pm",
    main: "プロジェクトマネージャー",
    sub: "（担当）",
  },
  {
    hash: "#recruit-engineer",
    main: "開発エンジニア",
    sub: "（正社員／契約社員）",
  },
  {
    hash: "#recruit-sales",
    main: "営業職",
    sub: "（正社員）",
  },
] as const;

function displayRecruitTitle(title: string): string {
  if (title.includes("プロジェクト")) {
    return "プロジェクトマネージャー（担当）";
  }
  if (title.includes("エンジニア")) {
    return "開発エンジニア（正社員/契約社員）";
  }
  if (title.includes("営業")) {
    return "営業職（正社員）";
  }
  return title;
}

function getRoleLine(item: JobEntity.Job): string | null {
  const duty = item.contents.find((c) => c.title === "職務内容");
  if (!duty?.description) {
    return null;
  }
  return `役職：${duty.description}`;
}

function getJobDutyBullets(item: JobEntity.Job): string[] {
  const work = item.contents.find((c) => c.title === "仕事内容");
  if (work?.list?.length) {
    return work.list;
  }
  if (!item.description?.trim()) {
    return [];
  }
  return item.description
    .split(/[；;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getQualificationBlocks(
  item: JobEntity.Job,
): { label: string; items: string[] }[] {
  const blocks: { label: string; items: string[] }[] = [];
  const { contents } = item;
  const salaryIdx = contents.findIndex((c) => c.title === "給与");
  if (salaryIdx < 0) {
    return blocks;
  }

  let start = contents.findIndex((c) => c.title === "応募資格");
  if (start < 0) {
    start = contents.findIndex(
      (c, i) =>
        i < salaryIdx &&
        Boolean(c.list?.length) &&
        Boolean(c.description?.includes("応募資格")),
    );
  }
  if (start < 0) {
    return blocks;
  }

  const first = contents[start];
  if (first.list?.length) {
    blocks.push({ label: "必須条件", items: first.list });
  }
  for (let j = start + 1; j < salaryIdx; j++) {
    const c = contents[j];
    if (!c.list?.length) {
      continue;
    }
    if (c.title === "仕事内容") {
      continue;
    }
    let label = "";
    if (c.description?.includes("歓迎")) {
      label = "歓迎";
    } else if (c.description?.includes("求める")) {
      label = "求める人材";
    } else {
      continue;
    }
    blocks.push({ label, items: c.list });
  }
  return blocks;
}

function parseSalary(desc?: string): { main: string; note: string } {
  if (!desc) {
    return { main: "", note: "" };
  }
  const idx = desc.indexOf("※");
  if (idx < 0) {
    return { main: desc.trim(), note: "" };
  }
  return {
    main: desc.slice(0, idx).trim(),
    note: desc.slice(idx).trim(),
  };
}

function getApplySectionData(jobs: JobEntity.Job[]): {
  applyMethod: JobEntity.Content | null;
  selection: JobEntity.Content | null;
  contactRaw: string | null;
} {
  const job =
    jobs.find((j) => j.contents.some((c) => c.title === "応募方法")) ??
    jobs[0] ??
    null;
  if (!job) {
    return { applyMethod: null, selection: null, contactRaw: null };
  }
  return {
    applyMethod: job.contents.find((c) => c.title === "応募方法") ?? null,
    selection: job.contents.find((c) => c.title === "選考プロセス") ?? null,
    contactRaw:
      job.contents.find((c) => c.title === "お問い合わせ")?.description ?? null,
  };
}

function parseRecruitContact(raw: string | null): {
  tel: string;
  attribution: string;
} {
  if (!raw?.trim()) {
    return { tel: "", attribution: "" };
  }
  const m = raw.trim().match(/^([\d-]+)\s*（(.+)）\s*$/);
  if (m) {
    return { tel: m[1], attribution: `（${m[2]}）` };
  }
  return { tel: raw.trim(), attribution: "" };
}

const RecruitApplySection: React.FC<{
  applyMethod: JobEntity.Content | null;
  selection: JobEntity.Content | null;
  contactRaw: string | null;
}> = ({ applyMethod, selection, contactRaw }) => {
  const { tel, attribution } = parseRecruitContact(contactRaw);
  if (!applyMethod && !selection) {
    return null;
  }

  return (
    <section
      id="recruit-apply"
      className="subpage-section recruit-apply"
      aria-label="応募について"
    >
      <header className="recruit-apply__header">
        <div className="recruit-apply__header-row">
          <span className="recruit-apply__bar" aria-hidden />
          <h2 className="recruit-apply__title">応募について</h2>
        </div>
        <div className="recruit-apply__header-rule" aria-hidden />
      </header>

      <div className="recruit-apply__panel">
        <div className="recruit-apply__grid">
          {applyMethod ? (
            <div className="recruit-apply__col">
              <div className="recruit-apply__col-head">応募方法</div>
              <div className="recruit-apply__col-body">
                {applyMethod.description ? (
                  <p className="recruit-apply__intro">{applyMethod.description}</p>
                ) : null}
                {applyMethod.list?.length ? (
                  <ul className="recruit-apply__list">
                    {applyMethod.list.map((line, i) => (
                      <li key={`am-${i}`}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}

          {selection ? (
            <div className="recruit-apply__col">
              <div className="recruit-apply__col-head">選考プロセス</div>
              <div className="recruit-apply__col-body">
                {selection.list?.length ? (
                  <ul className="recruit-apply__list">
                    {selection.list.map((line, i) => (
                      <li key={`sel-${i}`}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {tel ? (
          <div className="recruit-apply__contact">
            <p className="recruit-apply__contact-lead">
              採用についての電話でのお問い合わせはこちら
            </p>
            <p className="recruit-apply__tel">
              TEL.{tel}
            </p>
            {attribution ? (
              <p className="recruit-apply__contact-name">{attribution}</p>
            ) : null}
            <Link to="/inquiry" className="recruit-apply__mail-btn">
              メールはこちら
            </Link>
          </div>
        ) : (
          <div className="recruit-apply__contact">
            <Link to="/inquiry" className="recruit-apply__mail-btn">
              メールはこちら
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

const RecruitJobArticle: React.FC<{
  item: JobEntity.Job;
  index: number;
}> = ({ item, index }) => {
  const isSales = item.title.includes("営業");
  const roleLine = getRoleLine(item);
  const dutyBullets = getJobDutyBullets(item);
  const qualBlocks = getQualificationBlocks(item);
  const salaryBlock = item.contents.find((c) => c.title === "給与");
  const { main: salaryMain, note: salaryNote } = parseSalary(
    salaryBlock?.description,
  );
  const benefitsList = salaryBlock?.list ?? [];

  const dutyBlock = (
    <>
      <h3 className="recruit-detail__section-title">● 仕事内容</h3>
      <ul className="recruit-detail__bullets">
        {dutyBullets.map((line, li) => (
          <li key={`duty-${li}`}>{line}</li>
        ))}
      </ul>
    </>
  );

  return (
    <article
      id={recruitSectionId(item.title)}
      className={
        "recruit-detail"
      }
    >
      <header className="recruit-detail__header">
        <div className="recruit-detail__header-row">
          <span className="recruit-detail__bar" aria-hidden />
          <h2 className="recruit-detail__title">
            {displayRecruitTitle(item.title)}
          </h2>
        </div>
        <div className="recruit-detail__header-rule" aria-hidden />
      </header>

      {isSales ? (
        <>
          <div className="recruit-detail__split recruit-detail__split--sales-top">
            <div className="recruit-detail__main">
              {item.description ? (
                <p className="recruit-detail__lead">{item.description}</p>
              ) : null}
            </div>
            <div className="recruit-detail__media">
              <img
                src={getImageUrl(recruitImageForTitle(item.title))}
                alt={altForRecruitTitle(item.title)}
              />
            </div>
          </div>
          <div className="recruit-detail__after-split">
            {roleLine ? (
              <p className="recruit-detail__role-line">{roleLine}</p>
            ) : null}
            {dutyBlock}
          </div>
        </>
      ) : (
        <div className="recruit-detail__split">
          <div className="recruit-detail__main">
            {roleLine ? (
              <p className="recruit-detail__role-line">{roleLine}</p>
            ) : null}
            {dutyBlock}
          </div>
          <div className="recruit-detail__media">
            <img
              src={getImageUrl(recruitImageForTitle(item.title))}
              alt={altForRecruitTitle(item.title)}
            />
          </div>
        </div>
      )}

      {qualBlocks.length > 0 ? (
        <section
          className="recruit-detail__qual"
          aria-labelledby={`recruit-qual-${index}`}
        >
          <h3
            id={`recruit-qual-${index}`}
            className="recruit-detail__section-title"
          >
            ● 応募資格
          </h3>
          {qualBlocks.map((qb, qi) => (
            <div key={`${qb.label}-${qi}`} className="recruit-detail__qual-group">
              <span className="recruit-detail__badge">{qb.label}</span>
              <ul className="recruit-detail__bullets">
                {qb.items.map((line, li) => (
                  <li key={`q-${qi}-${li}`}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      <section
        className="recruit-detail__salary"
        aria-labelledby={`recruit-salary-${index}`}
      >
        <h3
          id={`recruit-salary-${index}`}
          className="recruit-detail__section-title"
        >
          ● 給与について
        </h3>
        {salaryMain ? (
          <p className="recruit-detail__salary-main">{salaryMain}</p>
        ) : null}
        {salaryNote ? (
          <p className="recruit-detail__salary-note">{salaryNote}</p>
        ) : null}
      </section>

      <div
        className={
          benefitsList.length > 0
            ? "recruit-detail__footer"
            : "recruit-detail__footer recruit-detail__footer--cta-only"
        }
      >
        {benefitsList.length > 0 ? (
          <div className="recruit-detail__notes">
            <div className="recruit-detail__notes-head">備考</div>
            <ul className="recruit-detail__bullets recruit-detail__bullets--notes">
              {benefitsList.map((line, li) => (
                <li key={`note-${li}`}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="recruit-detail__cta">
          <a href="#recruit-apply" className="recruit-detail__cta-btn">
            応募について
          </a>
        </div>
      </div>
    </article>
  );
};

const Recruit: React.FC = () => {
  const [items, setEvents] = useState<JobEntity.Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`${getDataBaseUrl()}/data/recruit.json?t=${timestamp}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: JobEntity.Job[]) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const orderedJobs = useMemo(() => sortJobsForDisplay(items), [items]);
  const applySection = useMemo(
    () => getApplySectionData(orderedJobs),
    [orderedJobs],
  );

  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="subpage subpage--recruit">
      <SubpageTitle titleJa="採用情報" titleEn="Recruit" as="h1" />
      <FaqStickyLink />
      <section className="subpage-section recruit-mv" aria-label="採用メインビジュアル">
        <div className="recruit-mv__hero">
          <div className="recruit-mv__copy">
            <p className="recruit-mv__line">あなたの技術力が、</p>
            <p className="recruit-mv__line">誰かの明日を変える</p>
          </div>
          <div className="recruit-mv__visual">
            <img
              className="recruit-mv__img"
              src={getImageUrl("/image/img_recruit_mv.png")}
              alt="オフィスで打ち合わせをするチームの写真"
            />
          </div>
        </div>
        <nav className="recruit-mv__nav" aria-label="募集職種へのページ内リンク">
          {RECRUIT_MV_NAV.map((item) => (
            <a key={item.hash} href={item.hash} className="recruit-mv__nav-item">
              <span className="recruit-mv__nav-main">{item.main}</span>
              <span className="recruit-mv__nav-sub">{item.sub}</span>
              <span className="recruit-mv__chevron" aria-hidden />
            </a>
          ))}
        </nav>
      </section>
      <section className="subpage-section recruit-roles" aria-label="募集職種">
        {orderedJobs.map((item, index) => (
          <RecruitJobArticle key={item.title} item={item} index={index} />
        ))}
      </section>
      <RecruitApplySection
        applyMethod={applySection.applyMethod}
        selection={applySection.selection}
        contactRaw={applySection.contactRaw}
      />
    </div>
  );
};

export default Recruit;
