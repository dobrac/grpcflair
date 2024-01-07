import Endpoint from "@/components/Endpoint";

export default function Home() {
  const title = "Swagger Petstore";
  const description =
    "This is a sample server Petstore server. You can find out more about Swagger at http://swagger.io or on irc.freenode.net, #swagger. For this sample, you can use the api key special-key to test the authorization filters.";
  const url = "https://petstore.swagger.io/v2/swagger.json";

  return (
    <main>
      <div className="py-5" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container">
          <h1>{title}</h1>
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
          <p className="mt-4 text-secondary">{description}</p>
        </div>
      </div>
      <div className="container py-3">
        <Endpoint />
      </div>
    </main>
  );
}
