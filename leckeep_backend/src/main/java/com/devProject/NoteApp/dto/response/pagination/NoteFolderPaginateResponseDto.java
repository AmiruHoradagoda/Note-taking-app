package com.devProject.NoteApp.dto.response.pagination;

import com.devProject.NoteApp.dto.response.NoteFolderResponseDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteFolderPaginateResponseDto {
    private List<NoteFolderResponseDto> dataList;
    private long dataCount;
}
