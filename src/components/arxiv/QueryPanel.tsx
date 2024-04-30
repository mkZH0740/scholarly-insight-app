import { IQueryParam, queryParamOperator } from "~/models/queryParam";
import { Button, Group, Paper, Stack } from "@mantine/core";
import React, { useState } from "react";
import { QueryParamInput } from "./QueryParamInput";

export interface IQueryParamProp {
  onSearch: (params: IQueryParam[]) => void;
}

export const QueryPanel: React.FC<IQueryParamProp> = ({ onSearch }) => {
  const [params, setParams] = useState<IQueryParam[]>([
    { key: "title", value: "", operator: queryParamOperator[0] },
  ]);

  return (
    <Paper shadow="xs" withBorder p="md">
      <Stack>
        {params.map((param, index) => (
          <QueryParamInput
            key={index}
            param={param}
            onUpdate={(param) => {
              setParams((prev) =>
                prev.map((prevParam, prevIndex) =>
                  prevIndex === index ? param : prevParam,
                ),
              );
            }}
            onDelete={() => {
              setParams((prev) =>
                prev.filter((_, prevIndex) => prevIndex !== index),
              );
            }}
          />
        ))}
        <Group>
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setParams((prev) => [
                ...prev,
                { key: "title", value: "", operator: queryParamOperator[0] },
              ]);
            }}
          >
            Add Condition
          </Button>
        </Group>
        <Group>
          <Button fullWidth onClick={() => onSearch(params)}>
            Search
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
