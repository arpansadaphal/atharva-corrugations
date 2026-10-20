import type { ReactNode } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  children?: ReactNode
}

/** Inner-page header: breadcrumb, the page's single H1 and an introduction (Sitemap §4.3, §6) */
export function PageHeader({ title, eyebrow, description, children }: PageHeaderProps) {
  return (
    <section data-surface="light" className="bg-paper-50 py-12 md:py-16">
      <div className="container-site flex flex-col gap-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: title }]} />
        <SectionHeader eyebrow={eyebrow} headline={title} headingLevel="h1" description={description} />
        {children}
      </div>
    </section>
  )
}
