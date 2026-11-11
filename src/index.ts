import './style.css';
import { createGrid, ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ChallengerEntry } from './types';

import { permamentData } from './assets/seed.ts';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const columnDefs = [
  {
    field: "authorName",
    headerName: "Challenger & Profile",
    width: 280,
    cellRenderer: (params: any) => {
      const data: ChallengerEntry = params.data;
      if (!data) return '';
      return `
        <div class="cell-profile">
          <img src="${data.avatarUrl}" class="cell-avatar" />
          <div>
            <div class="cell-author-name">${data.authorName}</div>
            <div class="cell-handle">@${data.handle}</div>
          </div>
        </div>
      `;
    }
  },
  {
    field: "tags",
    headerName: "Competencies & Materials",
    flex: 2,
    cellRenderer: (params: any) => {
      const tags: string[] = params.value || [];
      return `
        <div class="cell-tags">
          ${tags.map(tag => `<span class="tag-item">${tag}</span>`).join('<span class="tag-separator">,</span>')}
        </div>
      `;
    }
  },
  {
    field: "previews",
    headerName: "Map Assets",
    flex: 2,
    cellRenderer: (params: any) => {
      const previews: string[] = params.value || [];
      return `
        <div class="cell-previews">
          ${previews.map(img => `<img src="${img}" class="preview-thumb" />`).join('')}
        </div>
      `;
    }
  }
];

const gridOptions = {
  columnDefs: columnDefs,
  rowData: [] as ChallengerEntry[],
  rowHeight: 60,
  headerHeight: 44,
  defaultColDef: {
    sortable: true,
    resizable: true
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const gridDiv = document.querySelector('#challengerGrid') as HTMLElement;
  if (!gridDiv) return;

  const gridApi = createGrid(gridDiv, gridOptions);

  try {
    const mockData: ChallengerEntry[] = [
      {
        day: "12/11/26",
        authorName: "Helen Tochko",
        handle: "htochko",
        avatarUrl: "https://github.com/x-athone.png",
        tags: ["vitrage", "architecture", "technical drawing"],
        previews: [
          "https://t4.ftcdn.net/jpg/05/46/63/29/240_F_546632911_WrpB8CjWCn451TVeB2DgPkcAG33Cg0N6.jpg",
          "https://t4.ftcdn.net/jpg/06/10/04/51/240_F_610045187_a2w6l6ie0IeFqVigzOnLAaPAxFduG8gs.jpg",
          "https://t3.ftcdn.net/jpg/05/68/58/26/240_F_568582673_b1Qz80HdLBq3AWyLBsiwPWyJo8zvQ95j.jpg",
        ]
      },
      {
        day: "12/11/26",
        authorName: "Dariusz Ochman",
        handle: "1719hd",
        avatarUrl: "https://github.com/1719hd.png",
        tags: ["calligraphy", "architecture", "rock music posters"],
        previews: [
          "https://mir-s3-cdn-cf.behance.net/project_modules/hd_webp/7b342a238723609.691aea1d384bc.jpeg",
          "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/da0706243885503.698b2c4e539fd.png",
          "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/f90d50238423183.69146d5c581d7.jpeg",
        ]
      },
      ...permamentData,
    ];

    gridApi.setGridOption('rowData', mockData);
  } catch (err) {
    console.error("Failed to load data:", err);
  }
});