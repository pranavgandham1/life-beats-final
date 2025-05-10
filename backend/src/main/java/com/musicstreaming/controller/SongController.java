package com.musicstreaming.controller;

import com.musicstreaming.model.Song;
import com.musicstreaming.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/songs")
@CrossOrigin(origins = "http://localhost:5173")
public class SongController {

    @Autowired
    private SongService songService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public Song uploadSong(@RequestParam("file") MultipartFile file,
                           @RequestParam(value = "image", required = false) MultipartFile image,
                           @RequestParam("title") String title,
                           @RequestParam("artist") String artist,
                           @RequestParam("duration") String duration) throws IOException {

        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        Path uploadPath = Paths.get("src/main/resources/static/" + uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String imageFilename = null;
        if (image != null && !image.isEmpty()) {
            imageFilename = StringUtils.cleanPath(image.getOriginalFilename());
            Path imagePath = uploadPath.resolve(imageFilename);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
        }

        Song song = new Song();
        song.setTitle(title);
        song.setArtist(artist);
        song.setDuration(duration);
        song.setFilename(filename);
        song.setImageFilename(imageFilename);

        return songService.saveSong(song);
    }

    @GetMapping
    public List<Song> getAllSongs() {
        return songService.getAllSongs();
    }

    @GetMapping("/{id}")
    public Song getSong(@PathVariable Long id) {
        return songService.getSongById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
    }

    @GetMapping("/play/{filename}")
    public ResponseEntity<Resource> playSong(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get("src/main/resources/static/" + uploadDir).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    // Optional: Endpoint to serve image if needed
    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {
        Path imagePath = Paths.get("src/main/resources/static/" + uploadDir).resolve(filename);
        Resource image = new UrlResource(imagePath.toUri());

        if (!image.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // or use dynamic type detection
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(image);
    }
}
