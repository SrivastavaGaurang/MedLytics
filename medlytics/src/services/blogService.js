// services/blogService.js — Firestore implementation
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, arrayUnion, arrayRemove, increment,
  serverTimestamp, limit, startAfter,
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const BLOGS = 'blogs';

// ─── Get all published blogs ───────────────────────────────────────────────
export const getAllBlogs = async (pageSize = 20) => {
  const q = query(
    collection(db, BLOGS),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
};

// ─── Get single blog by ID (also increments views) ─────────────────────────
export const getBlogById = async (id) => {
  const ref = doc(db, BLOGS, id);
  await updateDoc(ref, { views: increment(1) });
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Blog not found');
  return { id: snap.id, _id: snap.id, ...snap.data() };
};

// ─── Create new blog ────────────────────────────────────────────────────────
export const createBlog = async (blogData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to create a blog.');

  const newBlog = {
    title: blogData.title,
    content: blogData.content,
    summary: blogData.summary || blogData.content.substring(0, 150) + '...',
    image: blogData.image || 'https://via.placeholder.com/800x400?text=Medical+Blog+Image',
    authorId: user.uid,
    authorName: blogData.author || user.displayName || 'MedLytics Team',
    tags: blogData.tags || [],
    published: true,
    likes: [],
    comments: [],
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, BLOGS), newBlog);
  return { id: docRef.id, _id: docRef.id, ...newBlog };
};

// ─── Update blog ────────────────────────────────────────────────────────────
export const updateBlog = async (id, blogData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to update a blog.');

  const ref = doc(db, BLOGS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Blog not found');
  if (snap.data().authorId !== user.uid) throw new Error('Not authorized to update this blog');

  const updates = {
    ...(blogData.title && { title: blogData.title }),
    ...(blogData.content && { content: blogData.content }),
    ...(blogData.summary && { summary: blogData.summary }),
    ...(blogData.image && { image: blogData.image }),
    ...(blogData.tags && { tags: blogData.tags }),
    ...(blogData.published !== undefined && { published: blogData.published }),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(ref, updates);
  const updated = await getDoc(ref);
  return { id: updated.id, _id: updated.id, ...updated.data() };
};

// ─── Delete blog ────────────────────────────────────────────────────────────
export const deleteBlog = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to delete a blog.');

  const ref = doc(db, BLOGS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Blog not found');
  if (snap.data().authorId !== user.uid) throw new Error('Not authorized to delete this blog');

  await deleteDoc(ref);
  return { message: 'Blog deleted successfully' };
};

// ─── Toggle like ────────────────────────────────────────────────────────────
export const toggleLikeBlog = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to like a blog.');

  const ref = doc(db, BLOGS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Blog not found');

  const likes = snap.data().likes || [];
  const isLiked = likes.includes(user.uid);

  await updateDoc(ref, {
    likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
  });

  return {
    message: isLiked ? 'Blog unliked' : 'Blog liked',
    isLiked: !isLiked,
    likeCount: isLiked ? likes.length - 1 : likes.length + 1,
  };
};

// ─── Add comment ────────────────────────────────────────────────────────────
export const addComment = async (id, content) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to comment.');
  if (!content?.trim()) throw new Error('Comment content is required.');

  const comment = {
    userId: user.uid,
    userName: user.displayName || 'User',
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const ref = doc(db, BLOGS, id);
  await updateDoc(ref, { comments: arrayUnion(comment) });
  return { message: 'Comment added successfully', comment };
};

// ─── Delete comment ─────────────────────────────────────────────────────────
export const deleteComment = async (blogId, commentObj) => {
  const ref = doc(db, BLOGS, blogId);
  await updateDoc(ref, { comments: arrayRemove(commentObj) });
  return { message: 'Comment deleted successfully' };
};

// ─── Get blogs by tag ───────────────────────────────────────────────────────
export const getBlogsByTag = async (tag) => {
  const q = query(
    collection(db, BLOGS),
    where('published', '==', true),
    where('tags', 'array-contains', tag),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
};

// ─── Get current user's own blogs ──────────────────────────────────────────
export const getMyBlogs = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(
    collection(db, BLOGS),
    where('authorId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
};

// ─── Search blogs (client-side, Firestore free tier has no full-text search) ─
export const searchBlogs = async (searchTerm) => {
  const all = await getAllBlogs(100);
  const lower = searchTerm.toLowerCase();
  return all.filter(b =>
    b.title?.toLowerCase().includes(lower) ||
    b.summary?.toLowerCase().includes(lower) ||
    b.content?.toLowerCase().includes(lower) ||
    b.authorName?.toLowerCase().includes(lower) ||
    b.tags?.some(t => t.toLowerCase().includes(lower))
  );
};