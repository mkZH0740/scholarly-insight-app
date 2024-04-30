import { IArxivArticle } from "~/models/arxiv";
import {
  Badge,
  Group,
  Stack,
  Title,
  Tooltip,
  Text,
  Anchor,
} from "@mantine/core";
import React from "react";

export interface IArticleElementProp {
  article: IArxivArticle;
}

export const ArticleDetail: React.FC<IArticleElementProp> = ({ article }) => {
  return (
    <Stack>
      <Title order={2}>{article.title}</Title>
      <Group>
        {article.authors.map((author) => (
          <Tooltip label={author.affiliation || author.name}>
            <Badge>{author.name}</Badge>
          </Tooltip>
        ))}
      </Group>
      <Text>{article.summary}</Text>
      <Text>published at: {article.publishedAt.toDateString()}</Text>
      <Text>updated at: {article.updatedAt.toDateString()}</Text>
      <Group>
        <Anchor href={article.abstractLink} target="_blank">
          Abstract
        </Anchor>
        <Anchor href={article.pdfLink} target="_blank">
          PDF
        </Anchor>
        {article.doiLink ? (
          <Anchor href={article.doiLink} target="_blank">
            DOI
          </Anchor>
        ) : (
          <></>
        )}
      </Group>
    </Stack>
  );
};
