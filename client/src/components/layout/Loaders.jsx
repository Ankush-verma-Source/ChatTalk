import { Grid, Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from "../styles/styledComponents";

function LayoutLoader() {
  return (
    <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
      <Grid
        size={{ sm: 4, md: 3 }}
        sx={{ display: { xs: "none", sm: "block" } }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
      <Grid size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={"5rem"} />
          ))}
        </Stack>
      </Grid>
      <Grid
        size={{ sm: 4, md: 4, lg: 3 }}
        sx={{
          display: { xs: "none", md: "block" },
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  );
}

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.4rem"}
      direction={"row"}
      padding={"0.6rem 1rem"}
      alignSelf={"flex-start"}
      sx={{
        bgcolor: "rgba(30,41,59,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px 18px 18px 4px",
        width: "fit-content",
      }}
    >
      {[0.1, 0.25, 0.4].map((delay, i) => (
        <BouncingSkeleton
          key={i}
          variant="circular"
          width={8}
          height={8}
          style={{
            animationDelay: `${delay}s`,
            backgroundColor: "#3b82f6",
            opacity: 0.7,
          }}
        />
      ))}
    </Stack>
  );
};

export { LayoutLoader, TypingLoader };
