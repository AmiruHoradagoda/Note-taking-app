package com.devProject.leckeep_backend.dto.response.pagination;

import com.devProject.leckeep_backend.dto.response.StudyGroupResponseDto;
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
public class StudyGroupPaginateResponseDto {
    private List<StudyGroupResponseDto> dataList;
    private long dataCount;
}
