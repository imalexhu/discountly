interface KeywordsGenerator {
    getKeywords(innerTextContent: string): Promise<string[]>
}