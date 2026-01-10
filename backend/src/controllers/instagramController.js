import * as instagramService from '../services/instagramService.js';

export async function getInstagramProfile(req, res) {
  try {
    const profile = await instagramService.getInstagramProfile();

    if (profile.error) {
      return res.status(500).json({ error: profile.error });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getInstagramFeed(req, res) {
  try {
    const limit = req.query.limit || 9;
    const feed = await instagramService.getInstagramFeed(limit);

    if (feed.error) {
      return res.status(500).json({ error: feed.error });
    }

    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getSavedInstagramPosts(req, res) {
  try {
    const limit = req.query.limit || 20;
    const posts = await instagramService.getSavedInstagramPosts(limit);

    res.json({ data: posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function syncInstagramFeed(req, res) {
  try {
    const result = await instagramService.syncInstagramFeed();

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ 
      success: true, 
      message: `Instagram feed synced. ${result.synced} posts saved.`,
      synced: result.synced
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
