import {
    Chapter,
    ChapterDetails,
    ContentRating,
    PagedResults,
    Request,
    Response,
    SourceInfo,
    SourceIntents,
    SourceManga,
    SourceStateManager
} from '@paperback/types'
import {getAuthorizationString} from './Common'
import {searchRequest} from '../Paperback/Common'
import {PaperbackInterceptor} from '@paperback/types/lib'

export const TheBlankInfo: SourceInfo = {
    contentRating: ContentRating.ADULT,
    description: 'TheBlank Pornwha',
    icon: 'icon.png',
    name: 'TheBlank',
    version: '1.0.0',
    developers: [{name: 'Red'}],
    capabilities: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI
}

export class TheBlankRequestInterceptor implements PaperbackInterceptor {
    id: string
    
    constructor(id: string) {
        this.id = id
    }

    async interceptRequest(request: Request): Promise<Request> {
        if (request.headers === undefined) {
            request.headers = {}
        }
        if (request.headers.authorization === undefined) {
            request.headers.authorization = await getAuthorizationString(this.stateManager)
        }
        return request
    }

    async interceptResponse(_request: Request, _response: Response, data: ArrayBuffer): Promise<ArrayBuffer> {
        return Buffer.from(data)
    }

    registerInterceptor(): void {
        Application.registerInterceptor(this.id,
            Application.Selector(
                this as PaperbackInterceptor,
                'interceptRequest'
            ),
            Application.Selector(
                this as PaperbackInterceptor,
                'interceptResponse'
            ))
    }

    unregisterInterceptor(): void {
        Application.unregisterInterceptor(this.id)
    }
    /*stateManager: SourceStateManager;

    constructor(stateManager: SourceStateManager) {
        this.stateManager = stateManager
    }

    async interceptRequest(request: Request): Promise<Request> {
        if (request.headers === undefined) {
            request.headers = {}
        }
        if (request.headers.authorization === undefined) {
            request.headers.authorization = await getAuthorizationString(this.stateManager)
        }
        return request
    }

    async interceptResponse(response: Response): Promise<Response> {
        return response
    }*/
    
}

export class TheBlank extends Source {
    stateManager = App.createSourceStateManager();
    requestManager = App.createRequestManager({
        requestsPerSecond: 2,
        requestTimeout: 10000,
        interceptor: new TheBlankRequestInterceptor(this.stateManager)
    });

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: []
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const chapters: Chapter[] = []
        chapters.push(App.createChapter({
            id: `${mangaId}/1`,
            chapNum: 1,
            langCode: 'en',
            name: 'Chapter 1',
            time: new Date()
        }))
        return chapters
    }

    async getMangaDetails(mangaId: string): Promise<SourceManga> {
        return App.createSourceManga({
            id: mangaId,
            mangaInfo: App.createMangaInfo({
                titles: ['Title'],
                image: `APIURL/${mangaId}.jpg`,
                desc: 'Summary',
                status: 'Hot',
            })
        })
    }

    override async getSearchResults(searchQuery: SearchRequest, metadata: any): Promise<PagedResults> {
        return searchRequest(searchQuery, metadata, this.requestManager, this.stateManager, 40)
    }
}