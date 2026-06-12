export default function StructuredData({ data }) {
  if (!data) return null
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, i) => (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          key={i}
          type="application/ld+json"
        />
      ))}
    </>
  )
}

