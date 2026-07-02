import BlogArticlePage from '@/components/BlogArticlePage'

export default function Supercomputing2024Page() {
  return (
    <BlogArticlePage
      date="November 2024"
      hero="/media/sc24-booth.jpg"
      kicker="SC24 Atlanta"
      title="Repping OSU at Supercomputing 2024"
      paragraphs={[
        "This was our first time bringing the CIC digital twin project onto a national supercomputing floor. We represented Oregon State at the Link Oregon booth and showed how an interactive simulation can make infrastructure decisions visible.",
        "The demo centered on a virtual server room built in NVIDIA Omniverse: live sensor data, heat maps, rack-layout tests, and the smart sliding door that kept pulling people into the conversation.",
        "The trip was dense in the best way. Long booth days, conversations with people from NVIDIA, Dell, Google, and late-night notes about how HPC work gets explained when the bottleneck is something people can actually see.",
        "What stuck with me is that strong systems work becomes easier to communicate when the constraint has shape. Cooling, memory, movement, scheduling, and data flow all become less abstract when they are visible inside a working scene.",
      ]}
      media={[
        { src: '/media/sc24-vr.jpg', alt: 'Omniverse digital twin demo on the show floor' },
        { src: '/media/sc24-robot.jpg', alt: 'SC24 show floor moment' },
        { src: '/media/sc24-crowd.jpg', alt: 'Conference floor and booth conversations' },
        { src: '/blog2/IMG_7034.jpg', alt: 'Supercomputing week travel notes' },
      ]}
    />
  )
}
