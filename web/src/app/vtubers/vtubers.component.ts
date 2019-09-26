import { OnInit, Component, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";

import { VTuber } from "@holostats/libs/models";

import { Config, ApiService } from "../services";

@Component({
  selector: "hs-vtubers",
  templateUrl: "./vtubers.component.html",
  styleUrls: ["./vtubers.component.scss"]
})
export class VTubersComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    public config: Config,

    private spinnerService: NgxSpinnerService
  ) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  updatedAt = "";

  dataSource: MatTableDataSource<VTuber> = new MatTableDataSource([]);

  ngOnInit() {
    this.spinnerService.show();
    this.apiService.getVTubers(this.config.selectedVTubers).subscribe(data => {
      this.spinnerService.hide();
      this.dataSource.data = data.vtubers;
      this.updatedAt = data.updatedAt;
    });

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "youtubeSubs":
          return item.youtubeStats.subs;
        case "youtubeDailySubs":
          return item.youtubeStats.dailySubs;
        case "youtubeViews":
          return item.youtubeStats.views;
        case "youtubeDailyViews":
          return item.youtubeStats.dailyViews;
        case "bilibiliSubs":
          return item.bilibiliStats.subs;
        case "bilibiliDailySubs":
          return item.bilibiliStats.dailySubs;
        case "bilibiliViews":
          return item.bilibiliStats.views;
        case "bilibiliDailyViews":
          return item.bilibiliStats.dailyViews;
        default:
          return item[property];
      }
    };
  }

  displayedColumns(): string[] {
    return this.config.selectedColumns.filter(c => c.length != 0);
  }

  getTotal = (path: (_: VTuber) => number) =>
    this.dataSource.data.map(path).reduce((acc, value) => acc + value, 0);
  totalYoutubeSubs = () => this.getTotal(v => v.youtubeStats.subs);
  totalYoutubeDailySubs = () => this.getTotal(v => v.youtubeStats.dailySubs);
  totalYoutubeViews = () => this.getTotal(v => v.youtubeStats.views);
  totalYoutubeDailyViews = () => this.getTotal(v => v.youtubeStats.dailyViews);
  totalBilibiliSubs = () => this.getTotal(v => v.bilibiliStats.subs);
  totalBilibiliDailySubs = () => this.getTotal(v => v.bilibiliStats.dailySubs);
  totalBilibiliViews = () => this.getTotal(v => v.bilibiliStats.views);
  totalBilibiliDailyViews = () =>
    this.getTotal(v => v.bilibiliStats.dailyViews);
}
