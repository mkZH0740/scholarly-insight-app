import { IArxivArticle } from "~/models/arxiv";
import { ActionIcon, Badge, Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";
import { IconBookmark } from "@tabler/icons-react";

export interface IArticleElementProp {
  article: IArxivArticle;
  onBrowse: (article: IArxivArticle) => void;
  onBookmark: (article: IArxivArticle) => void;
}

export const ArticleElement: React.FC<IArticleElementProp> = ({
  article,
  onBrowse,
  onBookmark,
}) => {
  return (
    <Paper shadow="xs" withBorder p="md">
      <Stack onClick={() => onBrowse(article)} className="w-full">
        <Group justify="space-between" className="flex-1">
          <Text size="sm" className="max-w-md" truncate="end">
            {article.title}
          </Text>
          <ActionIcon
            variant="outlined"
            color="gray"
            onClick={() => onBookmark(article)}
          >
            <IconBookmark
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
        <Group className="flex-1">
          {article.categories.map((category, index) => (
            <Badge key={index}>{category}</Badge>
          ))}
        </Group>
      </Stack>
    </Paper>
  );
};
