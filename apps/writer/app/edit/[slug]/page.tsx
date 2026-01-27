import { notFound } from "next/navigation";
import { Editor } from "@/components/editor";
import { getPost } from "@/lib/actions";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <Editor
      initialTitle={post.title}
      initialContent={post.content}
      initialDraft={post.draft}
      initialLang={post.lang}
      slug={slug}
    />
  );
}
