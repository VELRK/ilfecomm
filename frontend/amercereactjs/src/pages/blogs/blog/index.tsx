import PageTitle from "@/components/blogs/blog/PageTitle";
import Blog from "@/components/blogs/blog/Blog";
import PageMeta from "@/components/common/PageMeta";

const BlogPage = () => {
  return (
    <>
      <PageMeta
        title={"Blog | Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
        description={"Indian Ladies Fashion - Online Saree & Ethnic Wear Store"}
      />
      <PageTitle />
      <Blog />
    </>
  );
};

export default BlogPage;
