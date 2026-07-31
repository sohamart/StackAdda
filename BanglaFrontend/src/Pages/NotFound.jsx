import SEO from "../Components/SEO";
const NotFound = () => {
  return (
    <>
    <SEO title="Page Not Found" description="The page you are looking for does not exist." />
    <div className="min-h-screen flex justify-center items-center text-4xl text-white">
      <h1>404 Not Found</h1>
    </div>
    </>
  );
};

export default NotFound;
