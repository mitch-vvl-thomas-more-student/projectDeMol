export interface YoutubeApiResponse {
  videos: Video[]
  pageInfo: PageInfo
  nextPageToken: string
}

export interface Video {
  kind: string
  etag: string
  id: Id
  snippet: Snippet
}

export interface Id {
  kind: string
  videoId: string
}

export interface Snippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: Thumbnails
  channelTitle: string
  liveBroadcastContent: string
  publishTime: string
}

export interface Thumbnails {
  default: Default
  medium: Medium
  high: High
}

export interface Default {
  url: string
  width: number
  height: number
}

export interface Medium {
  url: string
  width: number
  height: number
}

export interface High {
  url: string
  width: number
  height: number
}

export interface PageInfo {
  totalResults: number
  resultsPerPage: number
}
