import axios from 'axios';
import { getDatabase } from '../config/database.js';

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';

export async function getInstagramProfile() {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      return { error: 'Instagram credentials not configured' };
    }

    const response = await axios.get(
      `${INSTAGRAM_API_BASE}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}`,
      {
        params: {
          fields: 'id,username,name,biography,profile_picture_url,followers_count,media_count',
          access_token: INSTAGRAM_ACCESS_TOKEN
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return { error: error.message };
  }
}

export async function getInstagramFeed(limit = 9) {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      return { error: 'Instagram credentials not configured' };
    }

    const response = await axios.get(
      `${INSTAGRAM_API_BASE}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          limit,
          access_token: INSTAGRAM_ACCESS_TOKEN
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return { error: error.message };
  }
}

export async function saveInstagramPost(postData) {
  try {
    const db = await getDatabase();

    await db.run(
      `INSERT INTO instagram_posts (post_id, caption, media_type, media_url, permalink, timestamp, likes, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(post_id) DO UPDATE SET likes=excluded.likes, comments=excluded.comments`,
      [
        postData.id,
        postData.caption || '',
        postData.media_type || 'IMAGE',
        postData.media_url || '',
        postData.permalink || '',
        postData.timestamp || new Date().toISOString(),
        postData.like_count || 0,
        postData.comments_count || 0
      ]
    );

    return { success: true, id: postData.id };
  } catch (error) {
    console.error('Error saving Instagram post:', error);
    return { error: error.message };
  }
}

export async function getSavedInstagramPosts(limit = 20) {
  try {
    const db = await getDatabase();

    const posts = await db.all(
      `SELECT * FROM instagram_posts ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );

    return posts || [];
  } catch (error) {
    console.error('Error getting saved Instagram posts:', error);
    return [];
  }
}

export async function syncInstagramFeed() {
  try {
    const feed = await getInstagramFeed(12);

    if (feed.error) {
      return { error: feed.error, synced: 0 };
    }

    let synced = 0;
    for (const post of feed.data || []) {
      const result = await saveInstagramPost(post);
      if (result.success) synced++;
    }

    return { success: true, synced };
  } catch (error) {
    console.error('Error syncing Instagram feed:', error);
    return { error: error.message, synced: 0 };
  }
}
