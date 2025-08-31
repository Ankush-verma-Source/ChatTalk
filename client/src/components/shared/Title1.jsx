import { HeadProvider , Title , Meta, Link  } from "react-head";

function Title1({
  title = "Chat App",
  description = "this is the Chat App called ChatTalk",
}) {
  return (
    <HeadProvider>
      {/* Head elements */}
      <Title>{title}</Title>
      <Meta name="description" content={description} />
      {/* <Link rel="icon" href="/favicon.ico" /> */}

      {/* Page content */}
    </HeadProvider>
  );
}

export default Title1;
