import { IArxivArticle, IArxivError } from "~/models/arxiv";
import { IQueryParam, queryParams } from "~/models/queryParam";

const arxivApiUrl = "https://export.arxiv.org/api/query?";
const arxivNamespaces: Record<string, string> = {
  atom: "http://www.w3.org/2005/Atom",
  arxiv: "http://arxiv.org/schemas/atom",
  opensearch: "http://a9.com/-/spec/opensearch/1.1/",
};
const NOT_FOUND = "not found";

const namespaceResolver = (prefix: string | null) => {
  if (!prefix) return null;
  return arxivNamespaces[prefix] ?? null;
};

const getNodeTextContent = <DefaultType>(
  xpath: string,
  xml: Document,
  context: Node,
  defaultValue: DefaultType,
) => {
  const textContent = xml
    .evaluate(xpath, context, namespaceResolver)
    .iterateNext()?.textContent;
  return textContent ?? defaultValue;
};

const getNodeAttribute = <DefaultType>(
  xpath: string,
  attribute: string,
  xml: Document,
  context: Node,
  defaultValue: DefaultType,
) => {
  const element = xml
    .evaluate(xpath, context, namespaceResolver)
    .iterateNext() as Element;
  return element?.getAttribute(attribute) ?? defaultValue;
};

const getNodes = (xpath: string, xml: Document, context: Node) => {
  const nodes: Element[] = [];
  const result = xml.evaluate(xpath, context, namespaceResolver);

  for (
    let node = result.iterateNext();
    node !== null;
    node = result.iterateNext()
  ) {
    nodes.push(node as Element);
  }

  return nodes;
};

const parseEntry = (entry: Node, xml: Document): IArxivArticle => {
  return {
    id: getNodeTextContent(".//atom:id", xml, entry, NOT_FOUND),
    title: getNodeTextContent(".//atom:title", xml, entry, NOT_FOUND),
    publishedAt: new Date(
      getNodeTextContent(".//atom:published", xml, entry, NOT_FOUND),
    ),
    updatedAt: new Date(
      getNodeTextContent(".//atom:updated", xml, entry, NOT_FOUND),
    ),
    summary: getNodeTextContent(".//atom:summary", xml, entry, NOT_FOUND),
    authors: getNodes(".//atom:author", xml, entry).map((node) => ({
      name: getNodeTextContent(".//atom:name", xml, node, NOT_FOUND),
      affiliation: getNodeTextContent(
        ".//arxiv:affiliation",
        xml,
        node,
        undefined,
      ),
    })),
    categories: getNodes(".//atom:category", xml, entry).map(
      (node) => node.getAttribute("term") ?? NOT_FOUND,
    ),
    abstractLink: getNodeAttribute(
      ".//atom:link[@rel='alternate']",
      "href",
      xml,
      entry,
      NOT_FOUND,
    ),
    pdfLink: getNodeAttribute(
      ".//atom:link[@rel='related'][@title='pdf']",
      "href",
      xml,
      entry,
      NOT_FOUND,
    ),

    primaryCategory: getNodeAttribute(
      ".//arxiv:primary_category",
      "term",
      xml,
      entry,
      undefined,
    ),
    doiLink: getNodeAttribute(
      ".//atom:link[@rel='related'][@title='doi']",
      "href",
      xml,
      entry,
      undefined,
    ),
    comment: getNodeTextContent(".//arxiv:comment", xml, entry, undefined),
    journalReference: getNodeTextContent(
      ".//arxiv:journal_ref",
      xml,
      entry,
      undefined,
    ),
    doi: getNodeTextContent(".//arxiv:doi", xml, entry, undefined),
  };
};

const parseError = (entry: Node, xml: Document): IArxivError => {
  return {
    id: getNodeTextContent(".//arxiv:id", xml, entry, NOT_FOUND),
    summary: getNodeTextContent(".//arxiv:summary", xml, entry, NOT_FOUND),
  };
};

export const queryArxiv = async (
  params: IQueryParam[],
  start = 0,
  maxResults = 20,
) => {
  const queryParamString = params
    .map(
      (param) =>
        `${queryParams[param.key as keyof typeof queryParams]}:${param.value}${param.operator === "NONE" ? "" : ` ${param.operator} `}`,
    )
    .join("");
  const requestUrl =
    arxivApiUrl +
    new URLSearchParams([
      ["search_query", queryParamString],
      ["start", `${start}`],
      ["max_results", `${maxResults}`],
    ]).toString();

  console.log(requestUrl);

  const parser = new DOMParser();
  const xmldata = await fetch(requestUrl, {}).then((response) =>
    response.text(),
  );

  const xml = parser.parseFromString(xmldata, "text/xml");
  const entries = getNodes(".//atom:entry", xml, xml);

  if (
    entries.length == 1 &&
    !entries[0]!.getElementsByTagName("published")[0]
  ) {
    return parseError(entries[0]!, xml);
  } else {
    return entries.map((entry) => parseEntry(entry, xml));
  }
};
