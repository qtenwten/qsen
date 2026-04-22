const ANALYTICS_EVENTS = {
  TOOL_USED: 'tool_used',
  QR_GENERATED: 'qr_generated',
  LINK_COPIED: 'link_copied',
  PASSWORD_GENERATED: 'password_generated',
  SEO_AUDIT_COMPLETED: 'seo_audit_completed',
  CALCULATOR_USED: 'calculator_used',
  ARTICLE_VIEWED: 'article_viewed',
  FEEDBACK_SENT: 'feedback_sent',
  SEARCH_PERFORMED: 'search_performed',
}

class AnalyticsService {
  constructor() {
    this.handlers = []
    this.sessionId = this.generateSessionId()
  }

  generateSessionId() {
    return `qsen_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  }

  on(event, handler) {
    this.handlers.push({ event, handler })
    return () => {
      this.handlers = this.handlers.filter((h) => h.event !== event || h.handler !== handler)
    }
  }

  emit(event, properties = {}) {
    const payload = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        url: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    }

    this.handlers.forEach(({ event: e, handler }) => {
      if (e === event || e === '*') {
        try {
          handler(payload)
        } catch (err) {
          console.error('[Analytics] Handler error:', err)
        }
      }
    })

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, payload.properties)
    }
  }

  trackToolUsed(toolSlug, properties = {}) {
    this.emit(ANALYTICS_EVENTS.TOOL_USED, {
      tool_slug: toolSlug,
      ...properties,
    })
  }

  trackQRGenerated(format, hasLogo, properties = {}) {
    this.emit(ANALYTICS_EVENTS.QR_GENERATED, {
      format,
      has_logo: hasLogo,
      ...properties,
    })
  }

  trackLinkCopied(toolSlug, linkType = 'result', properties = {}) {
    this.emit(ANALYTICS_EVENTS.LINK_COPIED, {
      tool_slug: toolSlug,
      link_type: linkType,
      ...properties,
    })
  }

  trackPasswordGenerated(length, hasSymbols, hasNumbers, properties = {}) {
    this.emit(ANALYTICS_EVENTS.PASSWORD_GENERATED, {
      length,
      has_symbols: hasSymbols,
      has_numbers: hasNumbers,
      ...properties,
    })
  }

  trackSEOAuditCompleted(score, url, properties = {}) {
    this.emit(ANALYTICS_EVENTS.SEO_AUDIT_COMPLETED, {
      score,
      url: typeof url === 'string' ? url.slice(0, 200) : '',
      ...properties,
    })
  }

  trackArticleViewed(slug, translationKey, properties = {}) {
    this.emit(ANALYTICS_EVENTS.ARTICLE_VIEWED, {
      slug,
      translation_key: translationKey,
      ...properties,
    })
  }

  trackSearchPerformed(query, resultCount, properties = {}) {
    this.emit(ANALYTICS_EVENTS.SEARCH_PERFORMED, {
      query: query.slice(0, 100),
      result_count: resultCount,
      ...properties,
    })
  }

  trackFeedbackSent(properties = {}) {
    this.emit(ANALYTICS_EVENTS.FEEDBACK_SENT, properties)
  }
}

export const analytics = new AnalyticsService()

export { ANALYTICS_EVENTS }
