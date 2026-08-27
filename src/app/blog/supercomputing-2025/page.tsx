import BlogArticlePage from '@/components/BlogArticlePage'

export const metadata = {
  title: 'SC25 Talk + Team Oregon - Abhishek Enaguthi',
  description:
    'Booth talk at Oregon Innovates, Link Oregon floor days, and leading Team Oregon through the SC25 competition in St. Louis.',
}

export default function Supercomputing2025Page() {
  return (
    <BlogArticlePage
      date="November 2025"
      hero="/media/sc25-collage.jpg"
      heroAlt="SC25 collage: Oregon Innovates booth, Team Oregon, competition table, and booth talk"
      heroLayout="top"
      kicker="SC25 · St. Louis · Oregon Innovates / Link Oregon"
      title="Talk and Team Oregon at Supercomputing 2025"
      paragraphs={[
        'Three jobs in one week: a booth talk at Oregon Innovates, days on the show floor with Link Oregon, and leading Team Oregon through the student competition.',
        'At the Oregon Innovates booth I stood at the podium and talked through our work for a small floor audience. Chairs close to the screen, people drifting in mid-sentence and staying. The slide deck was a field-note style recap of how we got here, not a product pitch.',
        'Behind me the sponsor banner was hard to miss: NVIDIA, Mark III Systems, PIVIT, and the Oregon university logos. Same Oregon stack that sponsored the booth presence all week.',
        'We lived on the Oregon Innovates floor with Link Oregon. Crater Lake backdrop, purple carpet, gray chairs, a white table with a laptop always open. The Linus Pauling line on the wall set the tone: the best way to have a good idea is to have a lot of ideas.',
        "Booth days meant walking visitors through what Team Oregon and the Oregon schools were doing in HPC, then pointing them toward the people who could go deeper. Less polished demo theater than SC24's digital twin loop, more of a working Oregon outpost on the SC25 floor.",
        'I led Team Oregon through the competition days. Black tablecloth, laptops and power bricks everywhere, the SC25 St. Louis banner behind us. The role was pacing: who owns the next run, when to stop chasing a broken build, how to hand off without dropping the thread.',
        'The group photo in front of the Link Oregon screen is the clean version of that week. The competition table is the real one. Same navy vests, same badges, a lot more cable management and quiet urgency.',
      ]}
    />
  )
}
