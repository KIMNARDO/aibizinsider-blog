"""Build styled HTML for all 19 posts and write them to files."""
import os
import sys
import json

sys.path.insert(0, os.path.dirname(__file__))
from generator import build_post, pick_related, RELATED_POOL
from posts_data import POSTS

# URL of each post by id, to avoid self-linking
POST_URLS = {
    562: 'https://aibizinsider.com/2026/04/10/tesla-korea-price-increase-apr-2026/',
    560: 'https://aibizinsider.com/2026/04/10/ai-dev-monitoring-claude-openai-gemini-apr-10/',
    555: 'https://aibizinsider.com/2026/04/10/ai-agent-architecture-advisor-gemini-openai-meta-april-10-2026/',
    547: 'https://aibizinsider.com/2026/04/09/claude-managed-agents-2026-04-09-evening/',
    543: 'https://aibizinsider.com/2026/04/09/ai-agent-claude-mythos-openai-enterprise-gemma4-april-9-2026/',
    535: 'https://aibizinsider.com/2026/04/08/ai-agent-orchestration-scion-goclaw-april-8-2026-evening/',
    530: 'https://aibizinsider.com/2026/04/08/claude-mythos-glasswing-glm51-agent-skills-april-8-2026/',
    507: 'https://aibizinsider.com/2026/04/07/ai-dev-tools-styleseed-attie-insforge-april-7-2026-evening/',
    503: 'https://aibizinsider.com/2026/04/07/ai-governance-turning-point-anthropic-openai-claude-code-april-7-2026/',
    490: 'https://aibizinsider.com/2026/04/06/ai-efficiency-offline-llm-token-reduction-ai-coding-april-2026/',
    481: 'https://aibizinsider.com/2026/04/05/ai-agent-emotion-prompt-agentnews-gemini-migration-april-2026-evening/',
    474: 'https://aibizinsider.com/2026/04/05/ai-code-agent-linux-vulnerability-goose-llm/',
    461: 'https://aibizinsider.com/2026/04/04/openai-codex-pricing-gradient-labs-google-vids/',
    460: 'https://aibizinsider.com/2026/04/04/cohere-korean-asr-claude-subscription-vercel/',
    287: 'https://aibizinsider.com/2026/04/03/cursor-3-qwen-copilot-sdk-gemini-flex-ai-dev-tools/',
    280: 'https://aibizinsider.com/2026/04/03/openai-122b-gemma-4-1bit-llm-weekly/',
    252: 'https://aibizinsider.com/2026/04/02/openai-122t-funding-google-ai-1bit-llm/',
    228: 'https://aibizinsider.com/2026/04/01/openai-122b-veo-3-1-claude-code-leak-apr-1/',
    225: 'https://aibizinsider.com/2026/04/01/openai-122b-claude-code-qwen-apr-1-2026/',
}

OUTDIR = os.path.dirname(__file__)


def main():
    for pid, d in POSTS.items():
        self_url = POST_URLS.get(pid, '')
        related = pick_related(self_url, n=3)
        html = build_post(
            title=d['title'],
            subtitle=d['subtitle'],
            date_str='',
            tldr_bullets=d['tldr'],
            sections=d['sections'],
            sources=d['sources'],
            related=related,
            footer_date=d['footer_date'],
        )
        outpath = os.path.join(OUTDIR, f'post_{pid}.html')
        with open(outpath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'wrote {outpath} ({len(html)} chars)')


if __name__ == '__main__':
    main()
