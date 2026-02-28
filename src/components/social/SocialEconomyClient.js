'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import TooltipIcon from '../ui/TooltipIcon';
import styles from './SocialEconomy.module.css';

export default function SocialEconomyClient({ lang, s }) {
  const [form, setForm] = useState({
    orgName: '',
    orgType: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire to backend / email
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <h1 className={styles.heroHeadline}>{s.hero.headline}</h1>
        <p className={styles.heroSubtitle}>{s.hero.subtitle}</p>
      </section>

      {/* ---- Why ---- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{s.why.title}</h2>
        <div className={styles.prose}>
          {s.why.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* ---- Personal story ---- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{s.story.title}</h2>
        <div className={styles.prose}>
          {s.story.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* ---- Closing quote ---- */}
      <section className={styles.closingSection}>
        <blockquote className={styles.closingQuote}>
          {s.closing.quote}
        </blockquote>
      </section>

      {/* ---- Toolkit ---- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{s.toolkit.title}</h2>
        <p className={styles.sectionSubtitle}>{s.toolkit.subtitle}</p>
        <div className={styles.toolkitGrid}>
          {s.toolkit.items.map((item) => (
            <div key={item.name} className={styles.toolCard}>
              <span className={styles.toolName}>{item.name}</span>
              <TooltipIcon text={item.tooltip} ariaLabel={s.moreInfo} />
            </div>
          ))}
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how-it-works" className={styles.section}>
        <h2 className={styles.sectionTitle}>{s.howItWorks.title}</h2>
        <div className={styles.stepsGrid}>
          {s.howItWorks.steps.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Who this is for ---- */}
      <section id="who-this-is-for" className={styles.section}>
        <h2 className={styles.sectionTitle}>{s.whoThisIsFor.title}</h2>
        <p className={styles.sectionSubtitle}>{s.whoThisIsFor.description}</p>
        <div className={styles.typesGrid}>
          {s.whoThisIsFor.types.map((type) => (
            <div key={type.name} className={styles.typeCard}>
              <div className={styles.typeName}>{type.name}</div>
              <p className={styles.typeDesc}>{type.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Currently working on ---- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{s.currentProject.title}</h2>
        <div className={styles.currentCard}>
          <p className={styles.currentPlaceholder}>{s.currentProject.placeholder}</p>
        </div>
      </section>

      {/* ---- Waitlist CTA ---- */}
      <section id="waitlist" className={styles.waitlistSection}>
        <h2 className={styles.sectionTitle}>{s.waitlist.title}</h2>
        <p className={styles.sectionSubtitle}>{s.waitlist.description}</p>

        {submitted ? (
          <div className={styles.submittedMsg}>{s.waitlist.submitted}</div>
        ) : (
          <form className={styles.waitlistForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <Input
                label={s.waitlist.orgName}
                required
                placeholder={s.waitlist.orgNamePlaceholder}
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              />
              <Input
                label={s.waitlist.orgType}
                required
                placeholder={s.waitlist.orgTypePlaceholder}
                value={form.orgType}
                onChange={(e) => setForm({ ...form, orgType: e.target.value })}
              />
            </div>
            <Input
              label={s.waitlist.email}
              required
              type="email"
              placeholder={s.waitlist.emailPlaceholder}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Textarea
              label={s.waitlist.message}
              required
              placeholder={s.waitlist.messagePlaceholder}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
            />
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? '...' : s.waitlist.submit}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
