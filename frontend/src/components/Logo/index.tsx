import React from "react";

interface TProps {
  multiplier?: number;
}

export default function Logo({ multiplier = 20 }: TProps) {
  return (
    <svg
      width={`${5 * multiplier}`}
      height={`${2 * multiplier}`}
      viewBox="0 0 1000 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m356.715 590.217 27.807-40.584c28.587-41.72 42.88-62.579 35.195-80.681-7.687-18.105-32.619-22.31-82.49-30.726L107.04 399.392c-31.535-5.32-47.3-7.983-50.005-1.291-2.702 6.688 10.49 15.727 36.872 33.804l131.215 89.908c6.982 4.784 10.474 7.177 11.156 10.831.683 3.654-1.71 7.146-6.494 14.128l-27.807 40.583c-28.587 41.72-42.88 62.58-35.195 80.681 7.688 18.104 32.619 22.311 82.486 30.725l230.19 38.835c31.537 5.32 47.302 7.983 50.006 1.292 2.703-6.688-10.49-15.728-36.87-33.804l-131.217-89.909c-6.982-4.784-10.474-7.177-11.156-10.83-.683-3.654 1.71-7.147 6.494-14.128z"
        fill="#222"
        style={{
          fill: "var(--primary)",
          fillOpacity: "1",
          strokeWidth: "35.907",
        }}
        transform="translate(11.988 -329.473) scale(.93136)"
      />
      <path
        d="M405.707 634.747q-9.728 0-16.213-6.656-6.486-6.656-6.486-20.821 0-12.63 4.95-26.454 5.12-13.994 15.018-23.552 10.07-9.728 23.894-9.728 6.997 0 10.41 2.39 3.414 2.39 3.414 6.314v1.195l1.877-9.045h24.576l-12.288 58.027q-.682 2.56-.682 5.46 0 7.34 6.997 7.34 4.779 0 8.192-4.438 3.584-4.437 5.632-11.605h7.168q-6.315 18.432-15.701 25.088-9.216 6.485-18.603 6.485-7.168 0-11.605-3.925-4.267-4.096-5.12-11.776-4.95 6.997-11.094 11.435-5.973 4.266-14.336 4.266zm11.094-16.554q4.266 0 8.362-3.926 4.267-4.096 5.803-11.093l8.192-38.57q0-2.22-1.707-4.268-1.706-2.218-5.29-2.218-6.827 0-12.288 8.021-5.462 7.85-8.534 19.115-3.072 11.093-3.072 19.627 0 8.533 2.39 10.922 2.56 2.39 6.144 2.39zm71.168-76.118h24.576l-2.73 12.8q8.533-7.339 19.967-7.339 9.558 0 15.19 6.315t5.632 20.65q0 13.484-3.926 27.308-3.925 13.653-13.312 23.38-9.386 9.558-24.746 9.558-10.923 0-14.507-6.144l-8.875 41.643-25.77 6.144zm15.36 77.824q8.192 0 13.483-7.68 5.46-7.68 7.85-18.261 2.56-10.752 2.56-19.968 0-14.166-8.533-14.166-3.072 0-6.315 2.22-3.072 2.218-5.461 6.143l-10.07 47.787q1.366 3.925 6.486 3.925zM631.5 519.718q-10.752.341-16.555 8.192-5.632 7.85-5.632 27.136 0 6.314 1.195 8.874 1.195 2.39 1.195 2.731-9.216 0-13.824-3.755-4.438-3.925-4.438-12.8 0-12.117 5.974-22.016 5.973-10.069 18.944-16.213 13.141-6.144 33.28-6.144 4.096 0 10.922.853 12.288 1.195 17.408 1.195 9.046 0 15.36-2.048-.512 1.536-1.877 6.827-1.365 5.12-4.95 8.874-3.413 3.584-9.386 4.78-10.07 0-23.893-3.244l-7.168 33.963h24.917l-2.73 12.63h-24.918l-13.824 64.17h-24.576zm63.659 114.688q-12.63 0-19.968-6.485-7.339-6.486-7.339-20.48 0-11.606 4.779-25.771 4.778-14.166 15.36-24.406 10.581-10.41 26.624-10.41 21.845 0 21.845 27.306v.171q.512.17 1.878.17 5.632 0 12.97-2.9 7.339-3.073 13.312-7.34l1.536 4.609q-4.95 5.29-12.97 9.045-7.851 3.584-17.238 5.12-1.365 15.53-6.997 27.136t-14.507 17.92q-8.875 6.315-19.285 6.315zm6.826-15.36q4.096 0 8.192-4.608 4.096-4.779 7.168-12.8 3.072-8.192 4.438-18.09-4.608-1.025-4.608-7.169 0-6.997 5.29-9.216-.34-5.632-1.706-7.68-1.366-2.219-4.779-2.219-5.632 0-10.923 8.192-5.29 8.192-8.533 19.627-3.243 11.435-3.243 20.139 0 8.192 1.878 11.093 1.877 2.73 6.826 2.73zm54.784-70.656h24.576l-2.218 10.581q5.802-5.12 10.41-7.85 4.78-2.731 10.24-2.731 5.462 0 8.534 3.754 3.243 3.755 3.243 9.046 0 4.95-3.243 8.704-3.243 3.754-9.046 3.754-3.754 0-5.12-1.706-1.194-1.878-1.877-5.29-.512-2.22-1.024-3.244t-1.877-1.024q-3.584 0-6.144 1.536-2.39 1.366-6.315 4.95l-13.653 64.853h-24.576ZM913.1 634.747q-10.41 0-15.36-5.461-4.778-5.632-4.778-13.824 0-3.584.853-8.021.853-4.608 1.707-8.875 1.024-4.267 1.365-5.461 1.365-5.974 2.56-11.776 1.195-5.803 1.195-9.387 0-8.704-6.144-8.704-4.438 0-7.851 4.437-3.413 4.267-5.461 11.264l-11.606 54.784h-24.576l12.459-58.88q.512-2.048.512-4.267 0-7.509-5.12-7.509-4.779 0-8.363 4.437-3.413 4.267-5.461 11.435l-11.606 54.784H802.85l18.091-85.333h24.576l-1.877 8.874q8.704-9.728 20.821-9.728 15.019 0 17.579 14.678 9.387-14.507 23.723-14.507 8.704 0 13.824 4.779 5.12 4.778 5.12 14.506 0 4.95-1.195 11.094-1.195 5.973-3.413 14.677-1.366 5.29-2.56 10.41-1.024 4.95-1.024 7.852 0 3.413 1.536 5.29 1.536 1.878 5.29 1.878 5.12 0 8.192-3.584 3.072-3.755 6.144-11.435h7.168q-6.314 18.773-14.677 25.259-8.192 6.314-17.067 6.314zm44.032 0q-8.192 0-13.824-3.072-5.632-3.242-8.362-8.192-2.73-5.12-2.73-10.581 0-5.632 2.73-9.728 2.56-4.267 6.314-6.144 6.656-11.947 11.606-24.064 4.95-12.288 9.387-26.454l25.258-3.413q.854 21.845 2.902 47.275.853 10.24.853 14.848 0 10.41-5.29 17.067-5.291 6.656-13.142 9.557-7.68 2.901-15.701 2.901zm-5.46-13.482q6.314 0 10.58-3.755 4.267-3.755 4.267-12.117 0-5.12-1.024-14.336-1.706-19.457-2.218-26.113-4.096 13.483-13.825 32.257 3.926 2.048 3.926 5.973 0 3.243-2.219 5.803-2.048 2.56-5.29 2.56-3.585 0-4.609-2.22 0 6.145 2.39 9.046 2.56 2.902 8.021 2.902z"
        style={{
          fontSize: "170.667px",
          lineHeight: "1",
          fontFamily: "Lobster",
          textAlign: "end",
          textOrientation: "upright",
          textAnchor: "end",
          fill: "var(--secondary)",
          strokeWidth: "7.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          paintOrder: "stroke markers fill",
          fillOpacity: "1",
        }}
        transform="translate(11.988 -329.473) scale(.93136)"
      />
    </svg>
  );
}
