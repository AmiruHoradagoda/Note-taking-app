package com.devProject.leckeep_backend.dto.response.pagination;

import lombok.*;

import java.util.List;

import com.devProject.leckeep_backend.dto.response.NoteFolderResponseDto;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteFolderPaginateResponseDto {
    private List<NoteFolderResponseDto> dataList;
    private long dataCount;
}
