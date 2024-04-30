import {
  IQueryParam,
  queryParamOperator,
  queryParams,
} from "~/models/queryParam";
import { CloseButton, Group, Select, TextInput } from "@mantine/core";
import React from "react";

export interface QueryParamInputProp {
  param: IQueryParam;
  onDelete: () => void;
  onUpdate: (param: IQueryParam) => void;
}

export const QueryParamInput: React.FC<QueryParamInputProp> = ({
  param,
  onDelete,
  onUpdate,
}) => {
  return (
    <Group miw={648}>
      <Select
        maw={172}
        data={Object.keys(queryParams)}
        defaultValue={"title"}
        value={param.key}
        onOptionSubmit={(value) =>
          onUpdate({
            ...param,
            key: value,
          })
        }
      />
      <TextInput
        placeholder="corresponding value"
        onChange={(event) =>
          onUpdate({
            ...param,
            value: event.target.value,
          })
        }
        miw={384}
      />
      <Select
        maw={96}
        data={queryParamOperator}
        defaultValue={queryParamOperator[0]}
        onOptionSubmit={(value) =>
          onUpdate({
            ...param,
            operator: value,
          })
        }
      />
      <CloseButton onClick={onDelete} />
    </Group>
  );
};
