package com.devProject.leckeep_backend.dto.response.pagination;

import com.devProject.leckeep_backend.dto.response.DocumentFileResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentFilePaginateResponseDto {
    private List<DocumentFileResponseDto> dataList;
    private long dataCount;
}
