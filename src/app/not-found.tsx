export default function NotFound() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/" />
      <script
        dangerouslySetInnerHTML={{
          __html: "location.replace('/');",
        }}
      />
    </>
  )
}
